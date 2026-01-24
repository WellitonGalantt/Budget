import { ClientService } from "../service/ClienteService";
import { createClienteInputDTO } from "../types/clientTypes";
import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/successResponse";

export class ClientController {
  constructor(private service: ClientService) {}

  create = asyncHandler(
    async (req: Request<{}, {}, createClienteInputDTO>, res: Response) => {
      const body = req.body;

      const userId = req.user!.userId;

      await this.service.create(body, userId);
      successResponse(res, 201);
    },
  );

  update = asyncHandler(
    async (
      req: Request<{ id: string }, {}, createClienteInputDTO>,
      res: Response,
    ) => {
      const body = req.body;
      const clientId = req.params.id;

      const userId = req.user!.userId;

      await this.service.update(body, userId, clientId);

      successResponse(res, 201);
    },
  );

  delete = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const clientId = req.params.id;

    const userId = req.user!.userId;

    await this.service.delete(userId, clientId);
    successResponse(res, 200);
  });
}
