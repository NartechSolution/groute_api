import express from "express";
import categoryRoutes from "./routes/categoryRoutes.mjs";
import memberRoutes from "./routes/memberRoutes.mjs";
import productRoutes from "./routes/productRoutes.mjs";

const router = express.Router();

router.use("/members", memberRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

export default router;
