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
  // const authorization = req.headers["authorization"];
  // const [schema, token] = authorization?.split(" ") ?? [];
  // if (!token || schema != "Bearer") {
  //   res
  //     .status(401)
  //     .json({ error: "Token Invalido! 1" });
  //   return;
  // }

  // Utilzando cookie ao inves do header Authorization
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as jwtPayload;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};
