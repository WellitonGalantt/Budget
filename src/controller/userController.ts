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

      res.status(201).json({ result: result });
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

    if (!body ) {
      res.status(204).json({ error: "Todos os os campos devem ser enviados!" });
      return;
    }

    try {
      const result = await this.service.login(body);

      res.status(201).json({ result: result });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };
}
