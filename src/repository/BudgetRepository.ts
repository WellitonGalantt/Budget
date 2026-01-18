import { PrismaClient } from "@prisma/client/extension";
import {
  createBudgetInputDTO,
  createBudgetOutputDTO,
  createItemBudgetInputDTO,
  getBudgetByIdOutputDTO,
  updateBudgetInputDTO,
  updateBudgetOutputDTO,
} from "../types/budgetTypes";
import prisma from "./prismaRepository";
import { randomUUID } from "node:crypto";

export class BudgetRepository {
  async create(
    input: createBudgetInputDTO,
    userId: string,
  ): Promise<createBudgetOutputDTO> {
    const budgetData = input.budget;
    const items = input.items;

    return prisma.$transaction(async (tx): Promise<createBudgetOutputDTO> => {
      const cliente = await tx.client.findFirst({
        where: {
          id: budgetData.client_id,
          user_id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!cliente) {
        throw new Error("Client not found or does not belong to the user");
      }

      const budgetCreated = await tx.budget.create({
        data: {
          ...input.budget,
          user_id: userId,
          public_id: randomUUID(),
        },
        select: {
          id: true,
          client_id: true,
          status: true,
          title: true,
          valid_until: true,
          currency: true,
          subtotal: true,
          discount_amount: true,
          total: true,
        },
      });

      await tx.budget_item.createMany({
        data: items.map((i) => ({
          budget_id: budgetCreated.id,
          service_id: i.service_id,
          name: i.name,
          description: i.description,
          unit: i.unit,
          quantity: i.quantity,
          unit_price: i.unit_price,
          line_total: i.quantity * i.unit_price,
          sort_order: i.sort_order,
        })),
      });

      const createdItems = await tx.budget_item.findMany({
        where: {
          budget_id: budgetCreated.id,
        },
        select: {
          budget_id: true,
          name: true,
          unit: true,
          quantity: true,
          unit_price: true,
          line_total: true,
          sort_order: true,
          created_at: true,
        },
      });

      const returnBudget = {
        ...budgetCreated,
        title: budgetCreated.title ? budgetCreated.title : "",
        valid_until: budgetCreated.valid_until ?? new Date(0),
      };

      return {
        budget: returnBudget,
        items: createdItems,
      };
    });
  }

  async updateBudget(
    input: updateBudgetInputDTO,
    userId: string,
    budgetId: string,
  ): Promise<updateBudgetOutputDTO> {
    return prisma.$transaction(async (tx) => {
      if (input.client_id) {
        const cliente = await tx.client.findFirst({
          where: {
            id: input.client_id,
            user_id: userId,
          },
          select: {
            id: true,
          },
        });

        if (!cliente) {
          throw new Error("Client not found or does not belong to the user");
        }
      }

      const currency = await tx.budget.findFirst({
        where: {
          id: budgetId,
          user_id: userId,
        },
        select: {
          id: true,
          subtotal: true,
          discount_amount: true,
          currency: true,
        },
      });

      if (!currency) {
        throw new Error("Budget not found or does not belong to the user!");
      }

      const newDiscount = input.discount_amount
        ? input.discount_amount
        : currency.discount_amount;

      if (currency.subtotal - newDiscount < 0) {
        throw new Error(
          "Repository error: Discount cannot be greater than the amount!",
        );
      }

      const updatedBudget = await tx.budget.update({
        data: {
          ...input,
          total: currency.subtotal - newDiscount,
        },
        where: {
          id: budgetId,
          user_id: userId,
        },
        select: {
          id: true,
          client_id: true,
          status: true,
          title: true,
          valid_until: true,
          currency: true,
          subtotal: true,
          discount_amount: true,
          total: true,
        },
      });

      const budgetItems = await tx.budget_item.findMany({
        where: {
          budget_id: budgetId,
        },
        select: {
          budget_id: true,
          name: true,
          unit: true,
          quantity: true,
          unit_price: true,
          line_total: true,
          sort_order: true,
        },
      });

      return {
        budget: updatedBudget,
        items: budgetItems,
      };
    });
  }

  async delete(userId: string, budgetId: string): Promise<void> {
    return await prisma.$transaction(async (tx) => {
      const budget = await tx.budget.findFirst({
        where: {
          id: budgetId,
          user_id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!budget) {
        throw new Error("Budget not found or does not belong to the user");
      }

      await tx.budget_item.deleteMany({
        where: {
          budget_id: budgetId,
        },
      });

      await tx.budget.delete({
        where: {
          id: budgetId,
          user_id: userId,
        },
      });
    });
  }

  async getById(
    userId: string,
    budgetId: string,
  ): Promise<getBudgetByIdOutputDTO> {
    return await prisma.$transaction(async (tx) => {
      const budget = await tx.budget.findFirst({
        where: {
          id: budgetId,
          user_id: userId,
        },
      });

      if (!budget) {
        throw new Error("Budget not found or does not belong to the user");
      }

      const items = await tx.budget_item.findMany({
        where: {
          budget_id: budgetId,
        },
      });

      return {
        budget,
        items,
      };
    });
  }

  async createItemBudget(
    item: createItemBudgetInputDTO,
    userId: string,
    budgetId: string,
  ): Promise<void> {
    return prisma.$transaction(async (tx) => {
      const budget = await tx.budget.findFirst({
        where: {
          id: budgetId,
          user_id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!budget) {
        throw new Error("Budget not found or does not belong to the user");
      }

      await tx.budget_item.create({
        data: {
          ...item,
          budget_id: budgetId,
        },
      });

      await tx.budget.update({
        where: {
          id: budgetId,
          user_id: userId,
        },
        data: {
          total: item.line_total,
        },
      });
    });
  }
}
