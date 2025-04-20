import prisma from "../config/prisma.mjs";
import MyError from "../utils/error.mjs";
import response from "../utils/response.mjs";
import { appendDomain, deleteFile } from "../utils/file.mjs";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.mjs";

class ProductController {
  getProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, categoryId } = req.query;

      // Convert to numbers and validate
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      // Calculate skip value for pagination
      const skip = (pageNum - 1) * limitNum;

      // Build the where condition for search and filters
      const where = {};
      if (search) {
        where.name = {
          contains: search,
        };
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Get products with pagination and search
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            category: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limitNum);

      return response(res, 200, "Products retrieved successfully", {
        products,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages,
        },
      });
    } catch (error) {
      return response(res, 500, error.message);
    }
  };

  getProductById = async (req, res) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!product) {
        throw new MyError("Product not found", 404);
      }

      return response(res, 200, "Product retrieved successfully", product);
    } catch (error) {
      return response(res, error.statusCode || 500, error.message);
    }
  };

  createProduct = async (req, res, next) => {
    let imagePath = null;
    try {
      const { error, value } = createProductSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const productData = { ...value };

      if (req.file) {
        imagePath = req.file.path;
        productData.image = appendDomain(imagePath);
      }

      const product = await prisma.product.create({
        data: productData,
      });

      return response(res, 201, "Product created successfully", product);
    } catch (error) {
      if (imagePath) {
        deleteFile(imagePath);
      }
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    let imagePath = null;
    try {
      const { id } = req.params;
      const { error, value } = updateProductSchema.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });
      if (!existingProduct) {
        throw new MyError("Product not found", 404);
      }

      // Prepare update data
      const updateData = { ...value };

      if (req.file) {
        imagePath = req.file.path;
        updateData.image = appendDomain(imagePath);

        // Delete old image if exists
        if (existingProduct.image) {
          deleteFile(existingProduct.image);
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      return response(res, 200, "Product updated successfully", product);
    } catch (error) {
      if (imagePath) {
        deleteFile(imagePath);
      }
      next(error);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });
      if (!existingProduct) {
        throw new MyError("Product not found", 404);
      }

      // Delete associated image if exists
      if (existingProduct.image) {
        deleteFile(existingProduct.image);
      }

      await prisma.product.delete({
        where: { id },
      });

      return response(res, 200, "Product deleted successfully");
    } catch (error) {
      return response(res, error.statusCode || 500, error.message);
    }
  };
}

export default ProductController;
