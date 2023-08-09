import { Request, Response } from "express";
import { Task } from "./entities";
import { User } from "../users/entities";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { title, orderByDate, orderByTitle } = req.query;
    const { id } = req.user;

    const taskRepository = Task;

    let tasksQuery = taskRepository
      .createQueryBuilder("task")
      .where("task.user.id = :id", { id });

    if (title) {
      tasksQuery = tasksQuery.andWhere("task.title ILIKE :title", {
        title: `%${title}%`,
      });
    }

    if (orderByDate === "ASC" || orderByDate === "DESC") {
      tasksQuery = tasksQuery.orderBy("task.updatedAt", orderByDate);
    } else {
      tasksQuery = tasksQuery.orderBy("task.updatedAt", "DESC"); // Orden predeterminado si no se proporciona
    }

    if (orderByTitle === "ASC" || orderByTitle === "DESC") {
      tasksQuery = tasksQuery.orderBy("task.title", orderByTitle);
    }

    const tasks = await tasksQuery.getMany();

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred." });
  }
};

export const getTaskById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = Task.findOne({ where: { id } });

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
    }: any = req;

    const user = await User.findOne({ where: { id } });
    const { title, description, status } = req.body;

    if (!user) return res.status(404).json({ message: "User not found" });

    const task = Task.create({
      title,
      description,
      status,
      user: user,
    });

    await Task.save(task);

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ where: { id: id } });

    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.update({ id }, { title, description, status });

    return res.json({ message: "Task updated" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { affected } = await Task.delete({ id });
    if (affected === 0) {
      return res.status(404).json({ message: "Unable to delete the task" });
    }

    return res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
