import { PrismaClient } from "@prisma/client/extension";
import {
  budget,
  createBudgetInputDTO,
  createBudgetOutputDTO,
  createItemBudgetInputDTO,
  createItemBudgetOutputDTO,
  getBudgetByIdOutputDTO,
  item,
  statusBudget,
  updateBudgetInputDTO,
  updateBudgetOutputDTO,
  updateItemBudgetInputDTO,
  updateItemBudgetOutputDTO,
} from "../types/budgetTypes";
import prisma from "./prismaRepository";
import { randomUUID } from "node:crypto";

export class BudgetRepository {
  async create(
    input: createBudgetInputDTO,
    userId: string,
  ): Promise<createBudgetOutputDTO> {
    const { budget: budgetData, items } = input;

    return prisma.$transaction(async (tx) => {
      // Verificação de Propriedade (Ownership Check)
      const cliente = await tx.client.findFirst({
        where: { id: budgetData.client_id, user_id: userId },
        select: { id: true },
      });

      if (!cliente) {
        throw new Error("Client not found or does not belong to the user");
      }

      // Escrita Aninhada (Nested Write) + include
      const budgetCreated = await tx.budget.create({
        data: {
          ...budgetData,
          user_id: userId,
          public_id: randomUUID(),
          // Criamos os itens dentro da mesma operação do budget
          // O prisma relaciona automaticamente os itens ao Budget
          budget_item: {
            create: items.map((i) => ({
              service_id: i.service_id,
              name: i.name,
              description: i.description,
              unit: i.unit,
              quantity: i.quantity,
              unit_price: i.unit_price,
              line_total: i.quantity * i.unit_price,
              sort_order: i.sort_order,
            })),
          },
        },
        // Retorna uma lista dos itens relacionados a esse Budget
        include: {
          budget_item: true,
        },
      });

      const { budget_item, ...budgetRaw } = budgetCreated;

      // Mapeamento de Saída (Clean Mapping)
      return {
        budget: {
          ...budgetRaw,
          status: budgetRaw.status as statusBudget,
          title: budgetRaw.title ?? "",
          valid_until: budgetRaw.valid_until ?? new Date(0),
        },
        items: budget_item.map((item) => ({
          ...item,
          created_at: item.created_at, // O Prisma já devolve Date
        })),
      };
    });
  }

  async updateBudget(
    input: updateBudgetInputDTO,
    userId: string,
    budgetId: string,
  ): Promise<updateBudgetOutputDTO> {
    return prisma.$transaction(async (tx) => {
      // Validação do Cliente (apenas se o client_id for enviado)
      if (input.client_id) {
        const clienteExists = await tx.client.findFirst({
          where: { id: input.client_id, user_id: userId },
          select: { id: true },
        });
        if (!clienteExists) throw new Error("Client not found or invalid");
      }

      // Busca de valores atuais (Precisamos do subtotal atual para validar o novo desconto)
      const current = await tx.budget.findFirst({
        where: { id: budgetId, user_id: userId },
        select: { subtotal: true, discount_amount: true },
      });

      if (!current) throw new Error("Budget not found");

      // Lógica de Negócio (Total e Desconto)
      const subtotal = current.subtotal;
      const discount = input.discount_amount ?? current.discount_amount;

      if (subtotal - discount < 0) {
        throw new Error("Discount cannot be greater than the subtotal!");
      }

      // Update Atômico com include
      const updated = await tx.budget.update({
        where: {
          id: budgetId,
          user_id: userId, // Garante que só edita o que é dele
        },
        data: {
          ...input,
          total: subtotal - discount,
        },
        include: {
          budget_item: true, // Já traz os itens sem precisar de um findMany separado
        },
      });

      return {
        budget: {
          ...updated,
          status: updated.status as statusBudget,
          title: updated.title ?? "",
        },
        items: updated.budget_item,
      };
    });
  }

  async delete(userId: string, budgetId: string): Promise<void> {
    // Usamos o transaction para garantir que ou apaga tudo ou nada
    await prisma.$transaction(async (tx) => {
      // Tentar deletar o orçamento DIRETAMENTE filtrando pelo userId
      // O deleteMany é usado aqui em vez de delete porque ele aceita filtros extras no 'where'
      // e não lança erro se não encontrar nada (ele retorna um contador)
      const budget = await tx.budget.deleteMany({
        where: {
          id: budgetId,
          user_id: userId,
        },
      });

      // Se o contador for 0, significa que o orçamento não existe ou não é do usuário
      if (budget.count === 0) {
        throw new Error("Budget not found or does not belong to the user");
      }

      // Se chegou aqui, o pai foi deletado. Agora limpamos os itens órfãos.
      // Nota: Se você configurou 'onDelete: Cascade' no Prisma, esta parte é automática!
      await tx.budget_item.deleteMany({
        where: {
          budget_id: budgetId,
        },
      });
    });
  }

  async getById(
    userId: string,
    budgetId: string,
  ): Promise<getBudgetByIdOutputDTO> {
    // Removido o $transaction (desnecessário para leituras simples)
    // Usamos 'include' para buscar Pai e Filhos em uma única consulta lógica
    const budgetWithItems = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        user_id: userId,
      },
      include: {
        budget_item: true, // Busca todos os itens relacionados automaticamente
      },
    });

    // Validação de existência e posse em um único cheque
    if (!budgetWithItems) {
      throw new Error("Budget not found or does not belong to the user");
    }

    const { budget_item, ...budgetRaw } = budgetWithItems;

    // Mapeamento para o DTO de saída
    return {
      budget: {
        ...budgetRaw,
        status: budgetRaw.status as statusBudget,
        // Garantindo consistência com o que fizemos no Create/Update
        title: budgetRaw.title ?? "",
        valid_until: budgetRaw.valid_until ?? new Date(0),
      },
      items: budget_item,
    };
  }

  async getAllBudgets(userId: string): Promise<budget[]> {
    const budgets = await prisma.budget.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" }, // Dica: Listas profissionais são sempre ordenadas
    });

    return budgets.map((b) => ({
      ...b,
      status: b.status as statusBudget,
      title: b.title ?? "",
      valid_until: b.valid_until ?? null,
    }));
  }

  async createItemBudget(
    item: createItemBudgetInputDTO,
    userId: string,
    budgetId: string,
  ): Promise<createItemBudgetOutputDTO> {
    return prisma.$transaction(async (tx) => {
      // 1. Criamos o item e validamos a existência do Budget em um só passo
      // Se o budgetId não existir, o Prisma lançará um erro de Foreign Key
      const createdItem = await tx.budget_item.create({
        data: {
          ...item,
          budget_id: budgetId,
        },
        select: {
          id: true,
          budget_id: true,
          name: true,
          unit: true,
          quantity: true,
          unit_price: true,
          line_total: true,
          sort_order: true,
        },
      });

      // 2. Atualização Atômica (O "Pulo do Gato")
      // Usamos o 'increment' do Prisma para evitar problemas de concorrência
      const updateResult = await tx.budget.updateMany({
        where: {
          id: budgetId,
          user_id: userId, // Validação de posse aqui
        },
        data: {
          subtotal: { increment: item.line_total },
          total: { increment: item.line_total },
        },
      });

      // Se o count for 0, o budget não era do usuário ou não existia
      if (updateResult.count === 0) {
        throw new Error("Budget not found or ownership denied");
      }

      return createdItem;
    });
  }

  async getItemBudgetById(itemId: string, userId: string): Promise<item> {
    // Eliminamos a Transaction (leitura não precisa de lock de transação)
    // Filtramos o Item pela "posse" do Orçamento em um só comando
    const item = await prisma.budget_item.findFirst({
      where: {
        id: itemId,
        budget: {
          // O Prisma faz o JOIN internamente para checar se o dono do budget é o userId
          user_id: userId,
        },
      },
      // Removido o 'select' manual se você quiser o objeto completo conforme o DTO
    });

    // Validação única
    if (!item) {
      // Se não encontrou, ou o item não existe ou o usuário não tem permissão
      throw new Error("Item not found or access denied");
    }

    return item as item;
  }

  async updateItemBudget(
    input: updateItemBudgetInputDTO,
    userId: string,
    itemId: string,
  ): Promise<updateItemBudgetOutputDTO> {
    return await prisma.$transaction(async (tx) => {
      // Atualização com Trava de Segurança
      // Só atualiza se o item pertencer a um budget do usuário
      const itemUpdated = await tx.budget_item
        .update({
          where: {
            id: itemId,
            budget: { user_id: userId }, // SECURITY: Garante que o item é do dono
          },
          data: input,
          select: {
            id: true,
            budget_id: true,
            name: true,
            unit: true,
            quantity: true,
            unit_price: true,
            line_total: true,
            sort_order: true,
          },
        })
        .catch(() => {
          throw new Error("Item not found or access denied");
        });

      // Agregação no Banco (Performance)
      // Pedimos ao banco para somar tudo. Ele é MUITO mais rápido nisso que o JS.
      // Nunca utilizar um reduce em caso de updates no banco. É muito mais lento.
      const aggregation = await tx.budget_item.aggregate({
        where: { budget_id: itemUpdated.budget_id },
        _sum: { line_total: true },
      });

      const newSubtotal = aggregation._sum.line_total ?? 0;

      // Busca do desconto para cálculo final do Total
      const budget = await tx.budget.findUnique({
        where: { id: itemUpdated.budget_id },
        select: { discount_amount: true },
      });

      // Update Final do Budget
      await tx.budget.update({
        where: { id: itemUpdated.budget_id },
        data: {
          subtotal: newSubtotal,
          total: newSubtotal - (budget?.discount_amount ?? 0),
        },
      });
      return itemUpdated;
    });
  }

  async deleteItemBudget(itemId: string, userId: string): Promise<void> {
    return await prisma.$transaction(async (tx) => {
      // Localizamos o item e validamos a posse simultaneamente
      const item = await tx.budget_item.findFirst({
        where: { id: itemId, budget: { user_id: userId } },
        select: { budget_id: true },
      });

      if (!item) throw new Error("Item not found or access denied");

      // Deletamos o item
      await tx.budget_item.delete({ where: { id: itemId } });

      // Agregamos o novo subtotal (SUM no banco)
      const aggregation = await tx.budget_item.aggregate({
        where: { budget_id: item.budget_id },
        _sum: { line_total: true },
      });

      const newSubtotal = aggregation._sum.line_total ?? 0;

      // Buscamos o desconto e atualizamos o Budget
      const budget = await tx.budget.findUnique({
        where: { id: item.budget_id },
        select: { discount_amount: true },
      });

      await tx.budget.update({
        where: { id: item.budget_id },
        data: {
          subtotal: newSubtotal,
          total: newSubtotal - (budget?.discount_amount ?? 0),
        },
      });
    });
  }

  async getAllItemsBudget(budgetId: string, userId: string): Promise<item[]> {
    // Sem transaction.
    // Buscamos os itens filtrando pela posse do pai (Budget)
    const items = await prisma.budget_item.findMany({
      where: {
        budget_id: budgetId,
        budget: { user_id: userId }, // Filtro de segurança lateral (JOIN implícito)
      },
      orderBy: { sort_order: "asc" }, // Boa prática: sempre retorne itens ordenados
    });

    // Em APIs profissionais, se não houver itens, retornamos []
    // Mas se você quiser validar se o BUDGET existe mesmo que esteja vazio:
    const budgetExists = await prisma.budget.findFirst({
      where: { id: budgetId, user_id: userId },
    });

    if (!budgetExists) throw new Error("Budget not found");

    return items as item[];
  }
}
