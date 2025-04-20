import { Router } from "express";
import { uploadSingle } from "multermate-es";
import { ensureDirMiddleware } from "../utils/file.mjs";
import ProductController from "../controller/productController.mjs";

const PATH = "uploads/products";
const router = Router();
const controller = new ProductController();

const upload = uploadSingle({
  destination: PATH,
  filename: "image",
});

const ensureDir = ensureDirMiddleware(PATH);

// Get all products
router.get("/", controller.getProducts);

// Get single product by id
router.get("/:id", controller.getProductById);

// Create new product
router.post("/", ensureDir, upload, controller.createProduct);

// Update product
router.put("/:id", ensureDir, upload, controller.updateProduct);

// Delete product
router.delete("/:id", controller.deleteProduct);

export default router;
