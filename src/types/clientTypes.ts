import * as z from "zod";

export const clientSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  notes: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type client = z.infer<typeof clientSchema>;

export const createClienteBodySchema = z.object({
  name: z.string().trim().max(40),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, "O Numero do documento deve ser apenas numero!")
    .min(11, "Numero de documento deve ter no minimo 11 digitos!")
    .max(14, "Numero de documento deve ter no maximo 14 digitos!"),
  email: z.string().trim().max(40),
  notes: z.string().trim().max(40).optional(),
});

export type createClienteInputDTO = z.infer<typeof createClienteBodySchema>;

export const updateClienteBodySchema = createClienteBodySchema.partial();

export type updateClienteInputDTO = z.infer<typeof updateClienteBodySchema>;

export const paramsClientIdSchema = z.object({
  id: z.uuid("ID invalido!"),
});
