import Joi from "joi";
import { TaskStatus } from "../interfaces";

export const createTaskDTO = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional(),
});
