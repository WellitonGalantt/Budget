import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { CreateUserInputDTO, loginInputDTO } from "../types/userTypes";

export class UserController {
  constructor(private service: UserService) {}

  create = async (req: Request<{}, {}, CreateUserInputDTO>, res: Response) => {
    const body = req.body;

    if (!body || !body.name || !body.email || !body.password) {
      res.status(204).json({ error: "Todos os os campos devem ser enviados!" });
      return;
    }

    try {
      const result = await this.service.create(body);

      res.status(201).json({ success: true, result: result });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  login = async (req: Request<{}, {}, loginInputDTO>, res: Response) => {
    const body = req.body;

    if (!body) {
      res.status(204).json({ error: "Todos os os campos devem ser enviados!" });
      return;
    }

    try {
      const result = await this.service.login(body);

      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      res.status(201).json({ success: true, id: result.id });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  getUser = async (req: Request<{ id: string }>, res: Response) => {
    const paramId = req.params.id;
    const userId = req.user?.userId;

    if (paramId != userId) {
      res.status(404).json({ error: "Id invalido!" });
      return;
    }

    if (!paramId) {
      res.status(204).json({ error: "Todos os os campos devem ser enviados!" });
      return;
    }

    try {
      const result = await this.service.getUser(userId);

      res.status(201).json({ result: result });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  verify = (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(401)
        .json({ error: "Not authenticated!", authenticated: false });
      return;
    }

    res.status(200).json({ authenticated: true });
  };
}
