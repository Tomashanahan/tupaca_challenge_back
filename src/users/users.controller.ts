import { Request, Response } from "express";
import { User } from "./entities";
import * as bcrypt from "bcrypt";
import { getJwt } from "../auth";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.createQueryBuilder("user")
      .take(1)
      .skip(0)
      .getMany();

    return res.json({
      users,
      links: {
        next: "http://localhost:3000/users?page=2",
        prev: null,
        first: "http://localhost:3000/users?page=1",
        last: "http://localhost:3000/users?page=2",
      },
      meta: {
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 1,
        totalItems: 20,
        totalPages: 2,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOneBy({ id });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    return res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
      token: getJwt({ id: user.id }),
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;

    await user.save();

    return res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
      token: getJwt({ id: user.id }),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOneBy({ id });
    if (!user) return res.status(404).json({ message: "Not user found" });

    await User.update({ id }, req.body);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await User.delete({ id });

    if (result.affected === 0)
      return res.status(404).json({ message: "User not found" });

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: error });
  }
};
