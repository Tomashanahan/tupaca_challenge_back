import { pagination } from "typeorm-pagination";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRoutes from "./users/users.routes";
import tasksRoutes from "./tasks/tasks.routes";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(pagination);

app.use("/api", userRoutes);
app.use("/api", tasksRoutes);

export default app;
