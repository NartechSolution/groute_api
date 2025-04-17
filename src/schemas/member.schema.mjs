import Joi from "joi";

export const memberLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// You can add more member-related schemas here
export const createMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  stackholderType: Joi.string(),
  gs1CompanyPrefix: Joi.string(),
  companyNameEnglish: Joi.string(),
  companyNameArabic: Joi.string(),
  contactPerson: Joi.string(),
  companyLandline: Joi.string(),
  mobileNo: Joi.string(),
  extension: Joi.string(),
  zipCode: Joi.string(),
  website: Joi.string(),
  gln: Joi.string(),
  address: Joi.string(),
  longitude: Joi.string(),
  latitude: Joi.string(),
  status: Joi.string().default("active"),
  gs1Userid: Joi.string(),
});

export const updateMemberSchema = Joi.object({
  email: Joi.string().email(),
  stackholderType: Joi.string(),
  gs1CompanyPrefix: Joi.string(),
  companyNameEnglish: Joi.string(),
  companyNameArabic: Joi.string(),
  contactPerson: Joi.string(),
  companyLandline: Joi.string(),
  mobileNo: Joi.string(),
  extension: Joi.string(),
  zipCode: Joi.string(),
  website: Joi.string(),
  gln: Joi.string(),
  address: Joi.string(),
  longitude: Joi.string(),
  latitude: Joi.string(),
  status: Joi.string(),
  gs1Userid: Joi.string(),
}).min(1);
