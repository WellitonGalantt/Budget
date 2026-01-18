import { title } from "node:process";
import { BudgetRepository } from "../repository/BudgetRepository";
import {
  createBudgetInputDTO,
  createBudgetOutputDTO,
  createItemBudgetInputDTO,
  getBudgetByIdOutputDTO,
  updateBudgetInputDTO,
  updateBudgetOutputDTO,
} from "../types/budgetTypes";
import { formatString, validateTypeUnit } from "../utils/formatStrings";
import { verifyAllowedKeys } from "../utils/verifyAllowedKeys";
import { isValidStatusBudget } from "../utils/isValidStatusBudget";

const alowedUpdateKeys = [
  "client_id",
  "status",
  "title",
  "notes",
  "valid_until",
  "currency",
  "discount_amount",
] as const;
// Quando colocamos 'as const' o TS entende que é um array de strings literais e não um array de strings genéricas
// Ou seja, cada string dentro do array é um tipo específico e não apenas uma string qualquer

// export const verifyAllowedKeys = (key: string): boolean => {
//   return alowedUpdateKeys.includes(key as typeof alowedUpdateKeys[number]);
// }

// Usando Set para melhorar a performance na verificação de chaves permitidas
// O set tem complexidade O(1) para operações de busca, enquanto o array tem complexidade O(n)
const alowedUpdateKeysSet = new Set<string>(alowedUpdateKeys);

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
    const allowedCreateItemKeys = [
      "budget_id",
      "service_id",
      "name",
      "description",
      "unit",
      "quantity",
      "unit_price",
      "line_total",
      "sort_order",
    ] as const;

    const allowedCreateBudgetKeys = [
      "client_id",
      "status",
      "title",
      "notes",
      "valid_until",
      "currency",
      "subtotal",
      "discount_amount",
      "total",
    ] as const;

    const allowedCreateBudgetKeysSet = new Set<string>(allowedCreateBudgetKeys);
    const allowedCreateItemKeysSet = new Set<string>(allowedCreateItemKeys);

    verifyAllowedKeys(budget, allowedCreateBudgetKeysSet);

    // ===== Budget =====

    if (!budget.title || budget.title.trim() === "") {
      throw new Error("Title is required");
    }

    if (!isValidStatusBudget(budget.status)) {
      throw new Error("Invalid status");
    }

    if (budget.valid_until) {
      const validUntilDate = new Date(budget.valid_until);
      if (isNaN(validUntilDate.getTime())) {
        console.log(validUntilDate);
        console.log(validUntilDate.getTime());
        throw new Error("Valid until must be a valid date");
      }
    }

    if (!budget.currency || budget.currency.trim() === "") {
      throw new Error("Currency is required");
    }

    if (budget.subtotal < 0) {
      throw new Error("Subtotal cannot be negative");
    }

    if (budget.discount_amount < 0) {
      throw new Error("Discount amount cannot be negative");
    }

    if (budget.total < 0) {
      throw new Error("Total cannot be negative");
    }

    // ===== Items =====

    if (!items || items.length === 0) {
      throw new Error("Budget must have at least one item");
    }

    for (const item of items) {
      verifyAllowedKeys(item, allowedCreateItemKeysSet);

      if (!item.name || item.name.trim() === "") {
        throw new Error("Item name is required");
      }

      if (item.quantity <= 0) {
        throw new Error("Item quantity must be greater than zero");
      }

      if (!validateTypeUnit(item.unit)) {
        throw new Error(
          "This item unit not valid, just values 'vl', 'hr' and 'un'",
        );
      }

      if (item.unit_price < 0) {
        throw new Error("Item unit price cannot be negative");
      }

      if (item.line_total < 0) {
        throw new Error("Item line total cannot be negative");
      }

      if (item.sort_order < 0) {
        throw new Error("Item sort order cannot be negative");
      }
    }

    const totalBudget = items.reduce((acc, i) => {
      return acc + Number(i.quantity * i.unit_price);
    }, 0);

    console.log(budget.title);

    const inputBgt: createBudgetInputDTO = {
      budget: {
        ...budget,
        title: formatString("none", budget.title),
        notes: budget.notes ? formatString("none", budget.notes) : "",
        currency: "BRL",
        total: totalBudget - budget.discount_amount,
      },
      items: items.map((i) => {
        const totalItem = i.quantity * i.unit_price;
        return {
          ...i,
          name: formatString("none", i.name),
          description: i.description ? formatString("none", i.description) : "",
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

    verifyAllowedKeys(budget, alowedUpdateKeysSet);

    // Filtrando apenas os campos que foram fornecidos para atualização
    const budgetDateUpdate: Record<string, any> = {};
    for (const key in budget) {
      const value = budget[key as keyof typeof budget];

      if (value !== undefined) {
        budgetDateUpdate[key] = value;
      }
    }

    // === Validacoes ===

    if (
      budgetDateUpdate.status &&
      !isValidStatusBudget(budgetDateUpdate.status)
    ) {
      throw new Error("Invalid status");
    }

    if (budgetDateUpdate.valid_until) {
      const validUntilDate = new Date(budgetDateUpdate.valid_until);
      if (isNaN(validUntilDate.getTime())) {
        console.log(validUntilDate);
        console.log(validUntilDate.getTime());
        throw new Error("Valid until must be a valid date");
      }
    }

    console.log(budgetDateUpdate);

    const inputDate: updateBudgetInputDTO = {
      ...budgetDateUpdate,
      title: budgetDateUpdate.title
        ? formatString("none", budgetDateUpdate.title)
        : "",
      notes: budgetDateUpdate.notes
        ? formatString("none", budgetDateUpdate.notes)
        : "",
    };
    // Quando estamos falando de update sem ter todos os campos obrigatórios, ele se torna uma atualização parcial
    // Um PATCH ao invés de um PUT, por isso o tipo deve ser Partial<type>
    return await this.repo.updateBudget(inputDate, userId, budgetId);
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

  async createItemBudget(
    item: createItemBudgetInputDTO,
    userId: string,
    budgetId: string,
  ): Promise<void> {
    const allowedCreateItemKeys = [
      "budget_id",
      "service_id",
      "name",
      "description",
      "unit",
      "quantity",
      "unit_price",
      "line_total",
      "sort_order",
    ] as const;

    const allowedCreateItemKeysSet = new Set<string>(allowedCreateItemKeys);
    verifyAllowedKeys(item, allowedCreateItemKeysSet);

    if (!item.name || item.name.trim() === "") {
      throw new Error("Item name is required");
    }

    if (item.quantity <= 0) {
      throw new Error("Item quantity must be greater than zero");
    }

    if (!validateTypeUnit(item.unit)) {
      throw new Error(
        "This item unit not valid, just values 'vl', 'hr' and 'un'",
      );
    }

    if (item.unit_price < 0) {
      throw new Error("Item unit price cannot be negative");
    }

    const input = {
      ...item,
      name: formatString("none", item.name),
      description: item.description
        ? formatString("none", item.description)
        : "",
      line_total: item.quantity * item.unit_price,
    };

    return await this.repo.createItemBudget(item, userId, budgetId);
  }
}
