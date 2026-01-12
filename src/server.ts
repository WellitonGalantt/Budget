import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/routes";

const app = express();

app.use(morgan("combined"));

app.use(helmet());

app.use(express.json());

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err?.message ?? "Internal server error" });
});

export default app;
