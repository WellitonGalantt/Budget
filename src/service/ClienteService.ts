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
    if (!input) {
      throw new Error("Body da requisição não enviado");
    }

    if (!input.name?.trim() || !input.email?.trim()) {
      throw new Error("Nome e email são obrigatórios!");
    }

    const nameFormated = formatString("uppercase", input.name);

    if (!isValidEmail(input.email)) {
      throw new Error("Formato de Email inválido!");
    }

    const existEmail = await this.repo.getByEmail(input.email, userId);
    if (existEmail) {
      throw new Error("Email ja esta cadastrado!");
    }

    if (!input.whatsapp || !isValidNumber(input.whatsapp)) {
      throw new Error("Numero nao informado ou formato inválido!");
    }

    if (input.notes) {
      input.notes = formatString("none", input.notes);
    }

    input.name = nameFormated;

    const resId = await this.repo.create(input, userId);

    return resId;
  }

  async update(input: updateClienteInputDTO, userId: string, clientId: string) {
    if (!input) {
      throw new Error("Body da requisição não enviado");
    }

    if (!input.name?.trim() || !input.email?.trim()) {
      throw new Error("Nome e email são obrigatórios!");
    }

    const nameFormated = formatString("uppercase", input.name);

    if (!isValidEmail(input.email)) {
      throw new Error("Formato de Email inválido!");
    }

    if (!input.whatsapp || !isValidNumber(input.whatsapp)) {
      throw new Error("Numero nao informado ou formato inválido!");
    }

    if (input.notes) {
      input.notes = formatString("none", input.notes);
    }

    input.name = nameFormated;

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
