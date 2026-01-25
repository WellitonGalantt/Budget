import * as z from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export const createUserBodySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres!"),
  email: z.email("Email invalido!"),
  password: z
    .string()
    .min(8, "Senha deve conter no minimo 8 caracter!")
    .regex(
      /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
      "Senha muito fraca!",
    ),
});

export type CreateUserInputDTO = z.infer<typeof createUserBodySchema>;

export type CreateUserOutputDTO = {
  id: string;
  name: string;
};

// === Login

export const loginUserBodySchema = z.object({
  email: z.email("Email invalido"),
  password: z.string().min(8, "Senha deve conter no minimo 8 caracter!"),
});

export type loginInputDTO = z.infer<typeof loginUserBodySchema>;

export type loginOutputDTO = {
  id: string;
  token: string;
};

// Get User

export const getUserParamsSchema = z.object({
  id: z.uuid("Invalid UUID"),
});

export type getUserOutputDTO = {
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
