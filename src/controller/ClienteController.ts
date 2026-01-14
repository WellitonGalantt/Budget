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
      return res.status(401).json({ error: "Não autenticado" });
    }

    const userId = req.user?.userId;

    try {
      await this.service.create(body, userId);

      res.status(201).json({ success: true });
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
  ) => {
    const body = req.body;
    const clientId = req.params.id;
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const userId = req.user?.userId;

    try {
      await this.service.update(body, userId, clientId);

      res.status(201).json({ success: true });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const clientId = req.params.id;
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const userId = req.user?.userId;

    try {
      await this.service.delete(userId, clientId);

      res.status(201).json({ success: true });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };
}
