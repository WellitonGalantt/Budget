import { BudgetService } from "../service/BudgetService";
import { Response, Request } from "express";
import {
  createBudgetInputDTO,
  createItemBudgetInputDTO,
  updateBudgetInputDTO,
  updateItemBudgetInputDTO,
} from "../types/budgetTypes";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/successResponse";

export class BudgetController {
  constructor(private service: BudgetService) {}

  create = asyncHandler(
    async (req: Request<{}, {}, createBudgetInputDTO>, res: Response) => {
      const body = req.body;
      const userId = req.user!.userId;

      await this.service.create(body, userId);
      successResponse(res, 201);
    },
  );

  update = asyncHandler(
    async (
      req: Request<{ id: string }, {}, updateBudgetInputDTO>,
      res: Response,
    ) => {
      const body = req.body;
      const budgetId = req.params.id;

      if (!budgetId) {
        return res.status(400).json({ error: "Budget ID is required" });
      }

      const userId = req.user!.userId;
      const result = await this.service.update(body, userId, budgetId);
      successResponse(res, 201, result);
    },
  );

  delete = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const budgetId = req.params.id;

    const userId = req.user!.userId;

    await this.service.delete(userId, budgetId);

    successResponse(res, 200);
  });

  getById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const budgetId = req.params.id;

      if (!budgetId) {
        return res.status(400).json({ error: "Budget ID is required" });
      }

      const userId = req.user!.userId;

      const result = await this.service.getbyId(userId, budgetId);

      successResponse(res, 200, result);
    },
  );

  getAllBudgets = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const result = await this.service.getAllBudgets(userId);

    successResponse(res, 200, result);
  });

  createItemBudget = asyncHandler(
    async (
      req: Request<{ id: string }, {}, createItemBudgetInputDTO>,
      res: Response,
    ) => {
      const item = req.body;
      const budgetId = req.params.id;

      if (!budgetId) {
        return res.status(400).json({ error: "Budget ID is required" });
      }

      const userId = req.user!.userId;

      await this.service.createItemBudget(item, userId, budgetId);

      successResponse(res, 201);
    },
  );

  updateItemBudget = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const item = req.body;
      const itemId = req.params.id;

      if (!itemId) {
        return res.status(400).json({ error: "Item ID is required" });
      }

      const userId = req.user!.userId;

      await this.service.updateItemBudget(item, userId, itemId);

      successResponse(res, 201);
    },
  );

  deleteItemBudget = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const itemId = req.params.id;

      if (!itemId) {
        return res.status(400).json({ error: "Item ID is required" });
      }

      const userId = req.user!.userId;

      await this.service.deleteItemBudget(itemId, userId);
      successResponse(res, 201);
    },
  );

  getItemBudgetById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const itemId = req.params.id;

      if (!itemId) {
        return res.status(400).json({ error: "Item ID is required" });
      }

      const userId = req.user!.userId;

      const result = await this.service.getItemBudgetById(itemId, userId);

      successResponse(res, 200, result);
    },
  );

  getAllItemsBudget = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const budgetId = req.params.id;

      if (!budgetId) {
        return res.status(400).json({ error: "Budget ID is required" });
      }

      const userId = req.user!.userId;

      const result = await this.service.getAllItemsBudget(budgetId, userId);

      res.status(201).json({ success: true, data: result });
    },
  );
}
