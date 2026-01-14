import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;
if (!SECRET) {
  throw new Error("SECRET não definida no .env");
}

export type jwtPayload = {
  userId: string;
  role: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers["authorization"];
  const [schema, token] = authorization?.split(" ") ?? [];
  if (!token || schema != "Bearer") {
    res
      .status(401)
      .json({ error: "Token Invalido! 1" });
    return;
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Token inválido! 2" });
      return;
    }

    req.user = decoded as jwtPayload;
    next();
  });
};
