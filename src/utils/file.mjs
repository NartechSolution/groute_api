import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const DOMAIN = process.env.DOMAIN ?? "https://api.nartec-solutions.com";

/**
 * Ensures a directory exists in the root folder, creates it if it doesn't exist
 * @param {string} dirName - The name of the directory to ensure exists
 * @returns {string} The absolute path of the directory
 */
const ensureDirExists = (dirName) => {
  try {
    // Get the current file's directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Get the root directory (two levels up from src/utils)
    const rootDir = path.join(__dirname, "..", "..");

    // Create the full path for the directory
    const dirPath = path.join(rootDir, dirName);

    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      // Create directory recursively
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    }

    return dirPath;
  } catch (error) {
    console.error(`Error enng directory exists: ${error.message}`);
    throw error;
  }
};

/**
 * Middleware to ensure a directory exists in the root folder, creates it if it doesn't exist
 * @param {string} dirName - The name of the directory to ensure exists
 * @returns {function} The middleware function
 */
export const ensureDirMiddleware = (dirName) => {
  return (req, res, next) => {
    ensureDirExists(dirName);
    next();
  };
};

/**
 * Appends the domain to the path
 * @param {string} path - The path to append the domain to
 * @returns {string} The path with the domain appended
 */
export const appendDomain = (path) => {
  const myPath = `${DOMAIN}/${path}`;
  return myPath;
};

/**
 * Deletes a file from the server
 * @param {string} path - The path of the file to delete
 */
export const deleteFile = (path) => {
  try {
    // If path is null, undefined, or empty, return early
    if (!path) {
      console.log("No file path provided to delete");
      return;
    }

    // Handle both cases: full URL and relative path
    let cleanPath;
    if (path.includes(DOMAIN)) {
      const pathParts = path.split(DOMAIN);
      cleanPath = pathParts[1] || path;
    } else {
      cleanPath = path;
    }

    // Remove leading slash if present
    cleanPath = cleanPath.startsWith("/") ? cleanPath.substring(1) : cleanPath;

    if (fs.existsSync(cleanPath)) {
      fs.unlinkSync(cleanPath);
      console.log(`File deleted: ${cleanPath}`);
    } else {
      console.log(`File not found: ${cleanPath}`);
    }
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    // Log the path that caused the error for debugging
    console.error("Attempted to delete file at path:", path);
  }
};
