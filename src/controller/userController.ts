import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { CreateUserInputDTO, loginInputDTO } from "../types/userTypes";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "zod";
import { successResponse } from "../utils/successResponse";

export class UserController {
  constructor(private service: UserService) {}

  create = asyncHandler(
    async (req: Request<{}, {}, CreateUserInputDTO>, res: Response) => {
      const body = req.body;

      const result = await this.service.create(body);

      successResponse(res, 201, result);
    },
  );

  login = asyncHandler(
    async (req: Request<{}, {}, loginInputDTO>, res: Response) => {
      const body = req.body;

      const result = await this.service.login(body);

      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      successResponse(res, 201, { id: result.id });
    },
  );

  getUser = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const paramId = req.params.id;
      const userId = req.user?.userId;

      if (paramId != userId) {
        res.status(404).json({ error: "Id invalido!" });
        return;
      }

      const result = await this.service.getUser(userId);

      successResponse(res, 200, result);
    },
  );

  verify = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(401)
        .json({ error: "Not authenticated!", authenticated: false });
      return;
    }

    successResponse(res, 200, { authenticated: true });
  });
}
