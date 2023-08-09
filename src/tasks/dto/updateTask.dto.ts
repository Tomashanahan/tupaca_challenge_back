import Joi from "joi";

export const updateTaskDTO = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().optional(),
});
