import cors from "cors";

import MyError from "../utils/error.mjs";

const whitelist = [
  "http://localhost:5173",
  "http://localhost:7700",
  "https://admin.nartec-solutions.com",
  "https://nartec-solutions.com",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new MyError("Origin not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

export default cors(corsOptions);
