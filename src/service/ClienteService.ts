import { ClientRepository } from "../repository/ClientRepository";
import {
  createClienteInputDTO,
  updateClienteInputDTO,
} from "../types/clientTypes";
import { formatString } from "../utils/formatStrings";
import { isValidNumber } from "../utils/numberValidation";
import { isValidEmail } from "../utils/validadeEmail";

export class ClientService {
  private repo: ClientRepository;

  constructor(repo: ClientRepository) {
    this.repo = repo;
  }

  async create(input: createClienteInputDTO, userId: string): Promise<string> {
    const existEmail = await this.repo.getByEmail(input.email, userId);
    if (existEmail) {
      throw new Error("Email ja esta cadastrado!");
    }

    const resId = await this.repo.create(input, userId);

    return resId;
  }

  async update(input: updateClienteInputDTO, userId: string, clientId: string) {
    await this.repo.update(input, userId, clientId);
    return;
  }

  async delete(userId: string, clientId: string) {
    if (!userId || !clientId) {
      throw new Error("userId and clientId is required!");
    }

    await this.repo.delete(userId, clientId);
  }
}
