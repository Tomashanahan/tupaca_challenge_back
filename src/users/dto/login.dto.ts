import Joi from "joi";

export const loginSchemaDTO = Joi.object({
  email: Joi.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).required(),
  password: Joi.string().min(6).max(12).required(),
});
