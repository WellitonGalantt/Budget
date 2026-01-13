import { ProfileRepository } from "../repository/ProfileRepository";
import {
  createProfileInputDTO,
  createProfileOutputDTO,
  updateProfileInputDTO,
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

  async update(body: updateProfileInputDTO, userId: string): Promise<void>{
    const result = await this.repo.update(body, userId);

    return;
  }

  async delete(userId: string, profileId: string): Promise<void>{
    const result = await this.repo.delete(userId, profileId);

    return;
  }
}
