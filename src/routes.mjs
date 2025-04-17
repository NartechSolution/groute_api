import express from "express";
import memberRoutes from "./routes/memberRoutes.mjs";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const router = express.Router();

router.use("/members", memberRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

export default router;
