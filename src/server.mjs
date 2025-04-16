import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import bodyParser from "body-parser";
import express from "express";

import cors from "./middlewares/cors.mjs";
import { errorHandler, notFoundHandler } from "./middlewares/error.mjs";
import routes from "./routes.mjs";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);

app.use("/public", express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
