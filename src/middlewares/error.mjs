import MyError from "../utils/error.mjs";
import response from "../utils/response.mjs";

// No route found
export const notFoundHandler = (req, res, next) => {
  const error = new MyError(`No route found for ${req.originalUrl}`, 404);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  console.log(error);
  let statusCode = 500;
  let message = "Internal server error";
  let data = null;
  let success = false;

  if (error instanceof MyError) {
    statusCode = error.statusCode || 500;
    message = error.message || message;
    data = error.data || null;
  }
  response(res, statusCode, success, message, data);
};
