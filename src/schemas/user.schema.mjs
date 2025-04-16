import Joi from "joi";

export const getUserByIdSchema = Joi.object({
  userId: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
});

export const assignOrRemoveRolesSchema = Joi.object({
  userId: Joi.string().required(),
  roleIds: Joi.array().items(Joi.string()).required(),
});
