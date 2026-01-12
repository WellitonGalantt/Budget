import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
  User,
} from "../types/userTypes";
import prisma from "./prismaRepository";


export default class UserRepository {
  async create(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const data = {
      name: input.name,
      email: input.email,
      password_hash: input.password,
    };

    

    const res = await prisma.user.create({ data });

    const returnData: CreateUserOutputDTO = {
      id: res.id,
      name: res.name,
    };

    return returnData;
  }

  async findByEmail(input: string): Promise<User> {
    const email = input;

    const resultQuery = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!resultQuery) {
      throw new Error("Email nao esta cadastrado!");
    }

    const user: User = resultQuery;

    return user;
  }

  async findById(input: string): Promise<User> {
    const id = input;

    const resultQuery = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!resultQuery) {
      throw new Error("Id invalido!");
    }

    const user: User = resultQuery;

    return user;
  }
}
