import fetch from "node-fetch";
import prisma from "../config/prisma.mjs";
import { memberLoginSchema } from "../schemas/member.schema.mjs";
import MyError from "../utils/error.mjs";

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

      // Return the exact original response
      res.status(200).json(apiData);
    } catch (error) {
      next(error);
    }
  }
}

export default MemberController;
