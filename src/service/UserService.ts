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

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export class UserService {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async create(body: CreateUserInputDTO): Promise<Error | CreateUserOutputDTO> {
    if (body.name.length <= 3) {
      throw new Error("Nome deve ter mais do que 3 caracteres!");
    }

    if (!isValidEmail(body.email)) {
      throw new Error("Formato de email incorreto!");
    }

    if (body.password.length <= 8) {
      throw new Error("Senha muito fraca!");
    }

    const existEmail = await this.repo.findByEmail(body.email);
    if(existEmail){
      throw new Error("Email ja cadastrado!")
    }

    const hashedPassword = await generateHash(body.password);
    body.password = hashedPassword;

    return await this.repo.create(body);
  }

  async login(body: loginInputDTO): Promise<loginOutputDTO> {
    const { email, password } = body;

    if (!isValidEmail(email)) {
      throw new Error("Formato de email incorreto!");
    }

    const resFindEmail = await this.repo.findByEmail(email);

    const comparePassword = await bcrypt.compare(
      password,
      resFindEmail.password_hash
    );
    if (!comparePassword) {
      throw new Error("Credenciais para login invalidas!");
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
