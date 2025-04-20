import jwt from "jsonwebtoken";
import MyError from "../utils/error.mjs";
import { verifyToken } from "../utils/token.mjs";

// Define a custom status code for token expiration
export const TOKEN_EXPIRED = 498; // Using 498 (Token expired/invalid) which is a non-standard but recognized code

/**
 * Middleware to authenticate requests using JWT
 * This extracts the token from the Authorization header and verifies it
 */
export const authenticate = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new MyError("Access denied. No token provided", 401);
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new MyError("Access denied. Invalid token format", 401);
    }

    try {
      // Verify the token
      const decoded = verifyToken(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      // Set user info in request object
      req.user = decoded;

      // Proceed to the next middleware/controller
      next();
    } catch (tokenError) {
      // Check specifically for token expiration
      if (tokenError instanceof jwt.TokenExpiredError) {
        throw new MyError("Access token has expired", TOKEN_EXPIRED);
      }

      // Other token errors
      throw new MyError("Invalid token", 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional middleware to check if user has specific roles
 * @param {string[]} roles - Array of allowed roles
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new MyError("User not authenticated", 401);
      }

      // If roles is not provided or empty, continue
      if (roles.length === 0) {
        return next();
      }

      // Check if the user's role is in the allowed roles
      if (req.user.role && roles.includes(req.user.role)) {
        return next();
      }

      throw new MyError("Access denied. Insufficient permissions", 403);
    } catch (error) {
      next(error);
    }
  };
};
