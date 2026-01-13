import { ClientService } from "../service/ClienteService";
import { createClienteInputDTO } from "../types/clientTypes";
import { Response, Request } from "express";

export class ClientController {
  constructor(private service: ClientService) {}

  create = async (
    req: Request<{}, {}, createClienteInputDTO>,
    res: Response
  ) => {
    const body = req.body;
    if (!req.user) {
      console.log("Erro no userId");
      return;
    }
    const userId = req.user?.userId;

    try {
      await this.service.create(req.body, userId);

      res.status(204).json({ Success: true });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  update = async (
    req: Request<{ id: string }, {}, createClienteInputDTO>,
    res: Response
  ) => {};

  delete = async (
    req: Request<{ id: string }, {}, createClienteInputDTO>,
    res: Response
  ) => {};
}
