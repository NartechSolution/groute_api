import fetch from "node-fetch";
import prisma from "../config/prisma.mjs";
import {
  memberLoginSchema,
  refreshTokenSchema,
} from "../schemas/member.schema.mjs";
import MyError from "../utils/error.mjs";
import response from "../utils/response.mjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.mjs";

class MemberController {
  /**
   * Login member via external API and sync with local database
   */
  async loginMember(req, res, next) {
    try {
      // Validate request body
      const { error, value } = memberLoginSchema.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 422);
      }

      const { email, password } = value;

      // Call external API
      const apiResponse = await fetch(
        "https://backend.gtrack.online/api/member/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const apiData = await apiResponse.json();

      // If external API login failed, forward the error
      if (!apiResponse.ok) {
        throw new MyError(
          apiData.message || "Login failed",
          apiResponse.status
        );
      }

      // If successful, sync user data with our database
      if (apiData.user) {
        const userData = apiData.user;

        // Upsert member record (create if not exists, update if exists)
        await prisma.member.upsert({
          where: { id: userData.id },
          update: {
            email: userData.email,
            stackholderType: userData.stackholderType,
            gs1CompanyPrefix: userData.gs1CompanyPrefix,
            companyNameEnglish: userData.companyNameEnglish,
            companyNameArabic: userData.companyNameArabic,
            contactPerson: userData.contactPerson,
            companyLandline: userData.companyLandline,
            mobileNo: userData.mobileNo,
            extension: userData.extension,
            zipCode: userData.zipCode,
            website: userData.website,
            gln: userData.gln,
            address: userData.address,
            longitude: userData.longitude,
            latitude: userData.latitude,
            status: userData.status,
            gs1Userid: userData.gs1Userid,
          },
          create: {
            id: userData.id,
            email: userData.email,
            stackholderType: userData.stackholderType,
            gs1CompanyPrefix: userData.gs1CompanyPrefix,
            companyNameEnglish: userData.companyNameEnglish,
            companyNameArabic: userData.companyNameArabic,
            contactPerson: userData.contactPerson,
            companyLandline: userData.companyLandline,
            mobileNo: userData.mobileNo,
            extension: userData.extension,
            zipCode: userData.zipCode,
            website: userData.website,
            gln: userData.gln,
            address: userData.address,
            longitude: userData.longitude,
            latitude: userData.latitude,
            status: userData.status,
            gs1Userid: userData.gs1Userid,
          },
        });
      }

      // Generate JWT tokens
      const accessToken = generateAccessToken({
        userId: apiData.user.id,
        email: apiData.user.email,
      });

      const refreshToken = generateRefreshToken({
        userId: apiData.user.id,
      });

      // Return the exact original response along with our tokens
      response(res, 200, true, "Login successful", {
        accessToken,
        refreshToken,
        GTrackResponse: apiData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refreshToken(req, res, next) {
    try {
      // Validate request body
      const { error, value } = refreshTokenSchema.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 422);
      }

      const { refreshToken } = value;

      try {
        // Verify the refresh token
        const decoded = verifyToken(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
        );

        // Check if user exists in database
        const member = await prisma.member.findUnique({
          where: {
            id: decoded.userId,
          },
        });

        if (!member) {
          throw new MyError("Invalid refresh token", 401);
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken({
          userId: member.id,
          email: member.email,
        });

        const newRefreshToken = generateRefreshToken({
          userId: member.id,
        });

        // Return new tokens
        response(res, 200, true, "Token refreshed successfully", {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (tokenError) {
        throw new MyError("Invalid or expired refresh token", 401);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default MemberController;
