import { BudgetService } from "../service/BudgetService";
import { Response, Request } from "express";
import {
  createBudgetInputDTO,
  createItemBudgetInputDTO,
  updateBudgetInputDTO,
  updateItemBudgetInputDTO,
} from "../types/budgetTypes";

export class BudgetController {
  constructor(private service: BudgetService) {}

  create = async (
    req: Request<{}, {}, createBudgetInputDTO>,
    res: Response,
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
    res: Response,
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

    if (!budgetId) {
      return res.status(400).json({ error: "Budget ID is required" });
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

  getAllBudgets = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const userId = req.user?.userId;

    try {
      const result = await this.service.getAllBudgets(userId);

      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  createItemBudget = async (
    req: Request<{ id: string }, {}, createItemBudgetInputDTO>,
    res: Response,
  ) => {
    const item = req.body;
    const budgetId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!budgetId) {
      return res.status(400).json({ error: "Budget ID is required" });
    }

    const userId = req.user?.userId;

    try {
      await this.service.createItemBudget(item, userId, budgetId);

      res.status(201).json({ success: true });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  updateItemBudget = async (req: Request<{ id: string }>, res: Response) => {
    const item = req.body;
    const itemId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const userId = req.user?.userId;

    try {
      await this.service.updateItemBudget(item, userId, itemId);

      res.status(201).json({ success: true });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  deleteItemBudget = async (req: Request<{ id: string }>, res: Response) => {
    const itemId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const userId = req.user?.userId;

    try {
      await this.service.deleteItemBudget(itemId, userId);

      res.status(201).json({ success: true });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  getItemBudgetById = async (req: Request<{ id: string }>, res: Response) => {
    const itemId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const userId = req.user?.userId;

    try {
      const result = await this.service.getItemBudgetById(itemId, userId);

      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };

  getAllItemsBudget = async (req: Request<{ id: string }>, res: Response) => {
    const budgetId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!budgetId) {
      return res.status(400).json({ error: "Budget ID is required" });
    }

    const userId = req.user?.userId;

    try {
      const result = await this.service.getAllItemsBudget(budgetId, userId);

      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      console.log(err.message);
      res.status(400).json({
        error: err.message,
        message: "Houve algum erro",
      });
    }
  };
}
