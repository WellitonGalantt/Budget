import { ProfileService } from "../service/ProfileService";
import {
  createProfileInputDTO,
  updateProfileInputDTO,
} from "../types/profileTypes";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "zod";
import { successResponse } from "../utils/successResponse";

export class ProfileController {
  constructor(private service: ProfileService) {}

  create = asyncHandler(
    async (req: Request<{}, {}, createProfileInputDTO>, res: Response) => {
      const body = req.body;
      const userId = req.user!.userId;

      const result = await this.service.create(body, userId);

      successResponse(res, 201, result);
    },
  );

  update = asyncHandler(
    async (req: Request<{}, {}, updateProfileInputDTO>, res: Response) => {
      const body = req.body;
      const userId = req.user!.userId;

      const result = await this.service.update(body, userId);

      successResponse(res, 200, result);
    },
  );

  delete = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const profileId = req.params.id;

    const userId = req.user!.userId;

    await this.service.delete(userId, profileId);

    successResponse(res, 200);
  });
}
