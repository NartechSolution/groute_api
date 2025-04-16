import express from "express";

import userRoutes from "./routes/userRoutes.mjs";

const router = express.Router();

router.use("/v1/user", userRoutes);

export default router;
