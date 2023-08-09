import Joi from "joi";

export const registerSchemaDTO = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().max(12).required(),
  lastName: Joi.string().optional().allow(""),
});
