export type client = {
  id: string;
  user_id: string;
  name: string;
  whatsapp: string;
  email: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
};

export type createClienteInputDTO = {
  user_id: string;
  name: string;
  whatsapp: string;
  email: string;
  notes: string;
  updated_at: Date;
};

export type updateClienteInputDTO = Partial<
  Omit<createClienteInputDTO, "user_id">
>;
