import {
  createProfileInputDTO,
  createProfileOutputDTO,
} from "../types/profileTypes";
import prisma from "./prismaRepository";

export class ProfileRepository {
  async create(input: createProfileInputDTO): Promise<createProfileOutputDTO> {
    const result = await prisma.profile.create({
      data: {
        ...input,
      },
      select: {
        id: true,
      },
    });

    return result;
  }
}
