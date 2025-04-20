import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

/**
 * Generate an access token
 * @param {Object} payload - The data to be stored in the token
 * @returns {string} The generated token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET || "your-secret-key", {
    expiresIn: JWT_EXPIRES_IN || "1h",
  });
};

/**
 * Generate a refresh token
 * @param {Object} payload - The data to be stored in the token
 * @returns {string} The generated token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET || "your-refresh-secret-key", {
    expiresIn: JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

/**
 * Verify a token
 * @param {string} token - The token to verify
 * @param {string} secret - The secret used to sign the token
 * @returns {Object} The decoded token payload
 */
export const verifyToken = (token, secret = JWT_SECRET) => {
  return jwt.verify(token, secret || "your-secret-key");
};
