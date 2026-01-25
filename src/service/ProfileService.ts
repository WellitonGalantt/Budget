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

  async create(
    body: createProfileInputDTO,
    userId: string,
  ): Promise<createProfileOutputDTO> {
    const result = await this.repo.create(body, userId);

    return result;
  }

  async update(body: updateProfileInputDTO, userId: string): Promise<void> {
    return await this.repo.update(body, userId);
  }

  async delete(userId: string, profileId: string): Promise<void> {
    return await this.repo.delete(userId, profileId);
  }
}
