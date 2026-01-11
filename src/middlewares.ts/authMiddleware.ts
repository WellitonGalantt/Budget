import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const SECRET = String(process.env.SECRET);
if (!SECRET) {
  console.log("Secret nao carregou!");
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
  const token = authorization?.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({ error: "Token invalido, token nao pode ser vazio!" });
    return;
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    req.user = decoded as jwtPayload;
    next();
  });
};
