import { ProfileService } from "../service/ProfileService";
import { createProfileInputDTO } from "../types/profileTypes";
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
}
