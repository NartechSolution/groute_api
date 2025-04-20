import prisma from "../config/prisma.mjs";
import MyError from "../utils/error.mjs";
import response from "../utils/response.mjs";
import { appendDomain, deleteFile } from "../utils/file.mjs";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.mjs";

class CategoryController {
  getCategories = async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;

      // Convert to numbers and validate
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      // Calculate skip value for pagination
      const skip = (pageNum - 1) * limitNum;

      // Build the where condition for search
      const where = {};
      if (search) {
        where.name = {
          contains: search,
        };
      }

      // Get categories with pagination and search
      const [categories, totalCount] = await Promise.all([
        prisma.category.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.category.count({ where }),
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limitNum);

      return response(res, 200, "Categories retrieved successfully", {
        categories,
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

  getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!category) {
        throw new MyError("Category not found", 404);
      }

      return response(res, 200, "Category retrieved successfully", category);
    } catch (error) {
      return response(res, error.statusCode || 500, error.message);
    }
  };

  createCategory = async (req, res, next) => {
    let imagePath = null;
    try {
      const { error, value } = createCategorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const categoryData = { ...value };

      if (req.file) {
        imagePath = req.file.path;
        categoryData.image = appendDomain(imagePath);
      }

      const category = await prisma.category.create({
        data: categoryData,
      });

      return response(res, 201, "Category created successfully", category);
    } catch (error) {
      if (imagePath) {
        deleteFile(imagePath);
      }
      next(error);
    }
  };

  updateCategory = async (req, res, next) => {
    let imagePath = null;
    try {
      const { id } = req.params;
      const { error, value } = updateCategorySchema.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });
      if (!existingCategory) {
        throw new MyError("Category not found", 404);
      }

      // Prepare update data
      const updateData = { ...value };

      if (req.file) {
        imagePath = req.file.path;
        updateData.image = appendDomain(imagePath);

        // Delete old image if exists
        if (existingCategory.image) {
          deleteFile(existingCategory.image);
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data: updateData,
      });

      return response(res, 200, "Category updated successfully", category);
    } catch (error) {
      if (imagePath) {
        deleteFile(imagePath);
      }
      next(error);
    }
  };

  deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });
      if (!existingCategory) {
        throw new MyError("Category not found", 404);
      }

      // Delete associated image if exists
      if (existingCategory.image) {
        deleteFile(existingCategory.image);
      }

      await prisma.category.delete({
        where: { id },
      });

      return response(res, 200, "Category deleted successfully");
    } catch (error) {
      return response(res, error.statusCode || 500, error.message);
    }
  };
}

export default CategoryController;
