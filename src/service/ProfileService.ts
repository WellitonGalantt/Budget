import { ProfileRepository } from "../repository/ProfileRepository";
import {
  createProfileInputDTO,
  createProfileOutputDTO,
} from "../types/profileTypes";

export class ProfileService {
  repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  async create(body: createProfileInputDTO): Promise<createProfileOutputDTO> {
    const result = await this.repo.create(body);

    return result;
  }
}
