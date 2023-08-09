import { Router } from "express";
import {
  getUsers,
  getUser,
  login,
  register,
  updateUser,
  deleteUser,
} from "./users.controller";

// express-joi-validation
import validator from "express-joi-validation";
import { loginSchemaDTO, registerSchemaDTO } from "./dto/";

const router = Router();
const validate = validator.createValidator({});

router.get("/users", getUsers);

router.get("/users/:id", getUser);

router.post("/users/login", validate.body(loginSchemaDTO), login);

router.post("/users/register", validate.body(registerSchemaDTO), register);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

export default router;
