import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    token = token.replace(/^Bearer\s+/, "");
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          // El token es inválido o ha expirado
          console.error("Token inválido o expirado");

          return res.status(401).send("Expired or Invalid Token");
        } else {
          // El token es válido y no ha expirado
          return (req.user = decoded);
        }
      }
    );
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};
