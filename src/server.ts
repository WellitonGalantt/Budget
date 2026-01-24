import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/routes";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const CORS = process.env.CORS_ORIGIN;

if (!CORS) {
  throw new Error("CORS_ORIGIN not defined in environment variables");
}

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: CORS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(morgan("combined"));

app.use(helmet());

app.use(express.json());

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//Quando ouver qualquer erro ele cai aqui
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    // Se estiver em desenvolvimento, mostra o erro completo, se for produção, esconde
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
