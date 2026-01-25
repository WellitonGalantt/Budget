import {
  createProfileInputDTO,
  createProfileOutputDTO,
  updateProfileInputDTO,
} from "../types/profileTypes";
import prisma from "./prismaRepository";

export class ProfileRepository {
  async create(
    input: createProfileInputDTO,
    userId: string,
  ): Promise<createProfileOutputDTO> {
    const result = await prisma.profile.create({
      data: {
        ...input,
        user_id: userId,
      },
      select: {
        id: true,
      },
    });

    return result;
  }

  async update(input: updateProfileInputDTO, userId: string): Promise<void> {
    const result = await prisma.profile.update({
      data: {
        ...input,
      },
      where: {
        user_id: userId,
      },
    });

    return;
  }

  async delete(userId: string, profileId: string): Promise<void> {
    const result = await prisma.profile.delete({
      where: {
        id: profileId,
        user_id: userId,
      },
    });

    return;
  }
}
