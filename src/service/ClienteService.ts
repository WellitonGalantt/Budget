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
    const nameFormated = formatString(input.name);
    if (!isValidEmail(input.email)) {
      throw new Error("Formato de Email invalido!");
    }

    if (!isValidNumber(input.whatsapp)) {
      throw new Error("Formato do numero invalido!");
    }

    input.name = nameFormated;
    input.user_id = userId;

    const resId = await this.repo.create(input);

    return resId;
  }

  async update(input: updateClienteInputDTO, userId: string, clientId: string) {
    if (input.name) {
      const nameFormated = formatString(input.name);
      input.name = nameFormated;
    }

    if (input.email) {
      if (!isValidEmail(input.email)) {
        throw new Error("Formato de Email invalido!");
      }
    }

    if (input.whatsapp) {
      if (!isValidNumber(input.whatsapp)) {
        throw new Error("Formato do numero invalido!");
      }
    }

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
