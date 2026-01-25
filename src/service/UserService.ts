import UserRepository from "../repository/UserRepository";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
  getUserOutputDTO,
  loginInputDTO,
  loginOutputDTO,
} from "../types/userTypes";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isValidEmail } from "../utils/validadeEmail";

dotenv.config();

const SECRET = String(process.env.SECRET);
if (!SECRET) {
  console.log("Secret nao carregou!");
}

async function generateHash(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

export class UserService {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async create(body: CreateUserInputDTO): Promise<Error | CreateUserOutputDTO> {
    const existEmail = await this.repo.findByEmail(body.email);
    if (existEmail) {
      throw new Error("Email ja cadastrado!");
    }

    const hashedPassword = await generateHash(body.password);
    body.password = hashedPassword;

    return await this.repo.create(body);
  }

  async login(body: loginInputDTO): Promise<loginOutputDTO> {
    const { email, password } = body;

    const resFindEmail = await this.repo.findByEmail(email);

    if (!resFindEmail) {
      throw new Error("Email not registred!");
    }

    const comparePassword = await bcrypt.compare(
      password,
      resFindEmail.password_hash,
    );

    if (!comparePassword) {
      throw new Error("Invalid Login Credentials!");
    }

    // Geração JWT Token
    const payload = {
      userId: resFindEmail.id,
      role: "user",
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    if (!token) {
      throw new Error("Token vazio, erro ao gerar token");
    }

    const output: loginOutputDTO = {
      id: resFindEmail.id,
      token,
    };

    return output;
  }

  async getUser(id: string): Promise<getUserOutputDTO> {
    const resFindId = await this.repo.findById(id);

    const output = {
      name: resFindId.name,
      is_active: resFindId.is_active,
      created_at: resFindId.created_at,
      updated_at: resFindId.updated_at,
    };

    return output;
  }
}
