import express from "express";
import memberRoutes from "./routes/memberRoutes.mjs";

const router = express.Router();

router.use("/members", memberRoutes);

export default router;
