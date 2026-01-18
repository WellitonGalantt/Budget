import { BudgetService } from "../service/BudgetService";
import { Response, Request } from "express";
import {
  createBudgetInputDTO,
  updateBudgetInputDTO,
} from "../types/budgetTypes";

export class BudgetController {
  constructor(private service: BudgetService) {}

  create = async (
    req: Request<{}, {}, createBudgetInputDTO>,
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
    req: Request<{ id: string }, {}, updateBudgetInputDTO>,
    res: Response
  ) => {
    const body = req.body;
    const budgetId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!budgetId) {
      return res.status(400).json({ error: "Budget ID is required" });
    }

    if (body && Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    const userId = req.user?.userId;

    try {
      const result = await this.service.update(body, userId, budgetId);

      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    const budgetId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const userId = req.user?.userId;

    try {
      await this.service.delete(userId, budgetId);

      res.status(200).json({ success: true });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const budgetId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const userId = req.user?.userId;

    try {
      const budget = await this.service.getbyId(userId, budgetId);

      res.status(200).json({ success: true, data: budget });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };
}
