import jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces";

export function getJwt(payload: JwtPayload): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });

  return token;
}
