import * as z from "zod";

export type Profile = {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  company_name: string;
  whatsapp: string;
  phone: string;
  website: string;
  logo_url: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  created_at: Date;
  updated_at: Date;
};

export const createProfileBodySchema = z.object({
  document_type: z.literal(
    ["cnpj", "cpf"],
    "Tipo de documento deve ser 'cnpj' ou 'cpf'!",
  ),
  document_number: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, "O Numero do documento deve ser apenas numero!")
    .min(11, "Numero de documento deve ter no minimo 11 digitos!")
    .max(14, "Numero de documento deve ter no maximo 14 digitos!"),
  company_name: z
    .string("Nome invalido!")
    .trim()
    .min(4, "Nome da empresa deve ter pelo menos 4 caracter!")
    .max(160, "Nome da empresa muito comprido!"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, "O WhatsApp deve conter apenas números")
    .min(10, "Número whatsapp muito curto")
    .max(15, "Número whatsapp muito longo")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, "O Telefone deve conter apenas números")
    .min(10, "Número telefone muito curto")
    .max(15, "Número telefone muito longo")
    .optional(),
  website: z.url("Url invalida!").optional(),
  logo_url: z.url("Url da logo invalida!").optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
});

export type createProfileInputDTO = z.infer<typeof createProfileBodySchema>;

export type createProfileOutputDTO = {
  id: string;
};

// ==== UPDATE ====

export const updateProfileBodySchema = createProfileBodySchema.partial();

export type updateProfileInputDTO = z.infer<typeof updateProfileBodySchema>;

// ==== Delete ====

export const deleteProfileParamsSchema = z.object({
  id: z.uuid(),
});
