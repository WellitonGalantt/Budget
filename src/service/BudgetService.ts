import { title } from "node:process";
import { BudgetRepository } from "../repository/BudgetRepository";
import {
  createBudgetInputDTO,
  createBudgetOutputDTO,
  createItemBudgetInputDTO,
  getBudgetByIdOutputDTO,
  updateBudgetInputDTO,
  updateBudgetOutputDTO,
  updateItemBudgetInputDTO,
} from "../types/budgetTypes";
import { formatString } from "../utils/formatStrings";

export class BudgetService {
  private repo: BudgetRepository;

  constructor(repo: BudgetRepository) {
    this.repo = repo;
  }

  async create(
    input: createBudgetInputDTO,
    userId: string,
  ): Promise<createBudgetOutputDTO> {
    const budget = input.budget;
    const items = input.items;

    const subTotalBudget = items.reduce((acc, item) => {
      return acc + item.quantity * item.unit_price;
    }, 0);

    const inputBgt: createBudgetInputDTO = {
      budget: {
        ...budget,
        subtotal: subTotalBudget,
        total: subTotalBudget - budget.discount_amount,
      },
      items: items.map((i) => {
        const totalItem = i.quantity * i.unit_price;
        return {
          ...i,
          line_total: totalItem,
        };
      }),
    };

    return await this.repo.create(inputBgt, userId);
  }

  async update(
    input: updateBudgetInputDTO,
    userId: string,
    budgetId: string,
  ): Promise<updateBudgetOutputDTO> {
    const budget = input;

    // Quando estamos falando de update sem ter todos os campos obrigatórios, ele se torna uma atualização parcial
    // Um PATCH ao invés de um PUT, por isso o tipo deve ser Partial<type>
    return await this.repo.updateBudget(budget, userId, budgetId);
  }

  async delete(userId: string, budgetId: string): Promise<void> {
    await this.repo.delete(userId, budgetId);
  }

  async getbyId(
    userId: string,
    budgetId: string,
  ): Promise<getBudgetByIdOutputDTO> {
    return await this.repo.getById(userId, budgetId);
  }

  async getAllBudgets(userId: string) {
    return await this.repo.getAllBudgets(userId);
  }

  async createItemBudget(
    item: createItemBudgetInputDTO,
    userId: string,
    budgetId: string,
  ): Promise<void> {
    const input = {
      ...item,
      line_total: item.quantity * item.unit_price,
    };

    return await this.repo.createItemBudget(input, userId, budgetId);
  }

  async updateItemBudget(
    item: updateItemBudgetInputDTO,
    userId: string,
    itemId: string,
  ) {
    return await this.repo.updateItemBudget(item, userId, itemId);
  }

  async deleteItemBudget(itemId: string, userId: string): Promise<void> {
    await this.repo.deleteItemBudget(itemId, userId);
  }

  async getItemBudgetById(itemId: string, userId: string) {
    return await this.repo.getItemBudgetById(itemId, userId);
  }

  async getAllItemsBudget(budgetId: string, userId: string) {
    return await this.repo.getAllItemsBudget(budgetId, userId);
  }
}
