import { ProfileService } from "../service/ProfileService";
import {
  createProfileInputDTO,
  updateProfileInputDTO,
} from "../types/profileTypes";
import { Request, Response } from "express";

export class ProfileController {
  constructor(private service: ProfileService) {}

  create = async (
    req: Request<{}, {}, createProfileInputDTO>,
    res: Response
  ) => {
    const body = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      console.log("error no user id");
      return;
    }
    body.user_id = userId;

    try {
      const result = await this.service.create(body);

      res.status(200).json({ Success: true, Result: result });
    } catch (err: any) {
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  update = async (
    req: Request<{}, {}, updateProfileInputDTO>,
    res: Response
  ) => {
    const body = req.body;
    if (!req.user) {
      console.log("Erro no userId");
      return;
    }
    const userId = req.user.userId;

    try {
      const result = await this.service.update(body, userId);

      res.status(200).json({ Success: true, Result: result });
    } catch (err: any) {
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const profileId = req.params.id;
    if (!req.user) {
      console.log("Erro no userId");
      return;
    }

    const userId = req.user.userId;

    try {
      await this.service.delete(userId, profileId);

      res.status(200).json({ Success: true });
    } catch (err: any) {
      res.status(400).json({
        error: err,
        message: "Houve algum erro",
      });
    }
  };
}
