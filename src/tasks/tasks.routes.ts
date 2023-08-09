import { Router } from "express";

import validator from "express-joi-validation";
import { createTaskDTO, updateTaskDTO } from "./dto";
import {
  getAllTasks,
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
} from "./tasks.controller";
import { verifyToken } from "../auth";

const router = Router();
const validate = validator.createValidator({});

router.get("/task", verifyToken, getAllTasks);

router.get("/task/:id", verifyToken, getTaskById);

router.post("/task", verifyToken, validate.body(createTaskDTO), createTask);

router.put("/task/:id", verifyToken, validate.body(updateTaskDTO), updateTask);

router.delete("/task/:id", verifyToken, deleteTask);

export default router;
