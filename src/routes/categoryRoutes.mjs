import { Router } from "express";
import { uploadSingle } from "multermate-es";
import CategoryController from "../controller/categoryController.mjs";
import { ensureDirMiddleware } from "../utils/file.mjs";

const PATH = "uploads/categories";
const router = Router();
const controller = new CategoryController();

const upload = uploadSingle({
  destination: PATH,
  filename: "image",
});

const ensureDir = ensureDirMiddleware(PATH);

// Get all categories
router.get("/", controller.getCategories);

// Get single category by id
router.get("/:id", controller.getCategoryById);

// Create new category
router.post("/", ensureDir, upload, controller.createCategory);

// Update category
router.put("/:id", ensureDir, upload, controller.updateCategory);

// Delete category
router.delete("/:id", controller.deleteCategory);

export default router;
