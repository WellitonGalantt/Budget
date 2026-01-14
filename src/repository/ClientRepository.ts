import {
  client,
  createClienteInputDTO,
  updateClienteInputDTO,
} from "../types/clientTypes";
import prisma from "./prismaRepository";

export class ClientRepository {
  async create(input: createClienteInputDTO, userId: string): Promise<string> {
    const result = await prisma.client.create({
      data: {
        user_id: userId,
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

  async getByEmail(email: string, userId: string): Promise<client> {
    const result = await prisma.client.findFirst({
      where: {
        email: email,
        user_id: userId,
      },
    });

    return result as client;
  }
}
