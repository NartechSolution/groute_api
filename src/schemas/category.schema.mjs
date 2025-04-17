import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Category name is required",
    "any.required": "Category name is required",
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Category name cannot be empty",
  }),
}).min(1);
