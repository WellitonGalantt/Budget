import {
  createClienteInputDTO,
  updateClienteInputDTO,
} from "../types/clientTypes";
import prisma from "./prismaRepository";

export class ClientRepository {
  async create(input: createClienteInputDTO): Promise<string> {
    const result = await prisma.client.create({
      data: {
        ...input,
      },
      select: {
        id: true,
      },
    });
    return result.id;
  }

  async update(
    input: updateClienteInputDTO,
    userId: string,
    clientId: string
  ): Promise<void> {
    const result = await prisma.client.update({
      data: {
        ...input,
      },
      where: {
        id: clientId,
        user_id: userId,
      },
    });
    return;
  }

  async delete(userId: string, clientId: string): Promise<void> {
    const result = await prisma.client.delete({
      where: {
        id: clientId,
        user_id: userId,
      },
    });
    return;
  }
}
