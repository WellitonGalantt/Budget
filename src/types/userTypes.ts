export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type CreateUserInputDTO = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserOutputDTO = {
  id: string;
  name: string;
};

export type loginInputDTO = {
  email: string;
  password: string;
};

export type loginOutputDTO = {
  id: string;
  token: string;
};
