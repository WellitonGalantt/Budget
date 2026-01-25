import * as z from "zod";

export const statusBudgetEnum = z.enum([
  "draft",
  "sent",
  "approved",
  "rejected",
  "canceled",
]);
export type statusBudget = z.infer<typeof statusBudgetEnum>;

export const valueUnitEnum = z.enum(["vl", "hr", "un"]);
export type valueUnit = z.infer<typeof valueUnitEnum>;

export const budgetSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  client_id: z.string().uuid(),
  public_id: z.string().max(32),
  status: statusBudgetEnum,
  title: z.string().trim().max(160).nullable(),
  notes: z.string().trim().nullable(),
  valid_until: z.coerce.date().nullable(),
  currency: z.string().length(3),
  subtotal: z.number().nonnegative(),
  discount_amount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type budget = z.infer<typeof budgetSchema>;

export const itemSchema = z.object({
  id: z.string().uuid(),
  budget_id: z.string().uuid(),
  service_id: z.string().uuid().nullable(),
  name: z.string().trim().max(160),
  description: z.string().trim().nullable(),
  unit: z.string().trim().max(40).default("service"),
  quantity: z.number().nonnegative(),
  unit_price: z.number().nonnegative(),
  line_total: z.number().nonnegative(),
  sort_order: z.number().int(),
  created_at: z.date(),
});
export type item = z.infer<typeof itemSchema>;

// ======= DTOS

// --- ITEM INPUT
export const createItemBudgetInputSchema = z.object({
  service_id: z.uuid("ID do serviço inválido!").optional(),
  name: z.string().trim().min(4).max(160),
  description: z.string().trim().max(160).optional(),
  unit: z.string().trim().max(40).default("service"),
  quantity: z.coerce.number().nonnegative(),
  unit_price: z.coerce.number().nonnegative(),
  line_total: z.coerce.number().nonnegative(),
  sort_order: z.coerce.number().int().default(0),
});
export type createItemBudgetInputDTO = z.infer<
  typeof createItemBudgetInputSchema
>;

// --- BUDGET COMPLETO INPUT
export const createBudgetBodySchema = z.object({
  budget: z.object({
    client_id: z.string().uuid("ID do cliente inválido!"),
    status: statusBudgetEnum.default("draft"),
    title: z.string().trim().min(4).max(160),
    notes: z.string().trim().optional(),
    valid_until: z.coerce.date().nullable(),
    currency: z.string().length(3).default("BRL"),
    subtotal: z.coerce.number().nonnegative(),
    discount_amount: z.coerce.number().nonnegative().default(0),
    total: z.coerce.number().nonnegative(),
  }),
  items: z
    .array(createItemBudgetInputSchema)
    .nonempty("O orçamento deve conter pelo menos um item"),
});
export type createBudgetInputDTO = z.infer<typeof createBudgetBodySchema>;

// --- UPDATES (Partials)
export const updateBudgetInputSchema =
  createBudgetBodySchema.shape.budget.partial();
export type updateBudgetInputDTO = z.infer<typeof updateBudgetInputSchema>;

export const updateItemBudgetInputSchema = createItemBudgetInputSchema
  .partial()
export type updateItemBudgetInputDTO = z.infer<
  typeof updateItemBudgetInputSchema
>;

// ====

export const paramsBudgetIdSchema = z.object({
  id: z.uuid("ID invalido!"),
});

// ==== Outputs

export const createItemBudgetOutputSchema = itemSchema.pick({
  id: true,
  budget_id: true,
  name: true,
  unit: true,
  quantity: true,
  unit_price: true,
  line_total: true,
  sort_order: true,
});

export type createItemBudgetOutputDTO = z.infer<
  typeof createItemBudgetOutputSchema
>;

export const createBudgetOutputSchema = z.object({
  budget: budgetSchema.pick({
    id: true,
    client_id: true,
    status: true,
    title: true,
    valid_until: true,
    currency: true,
    subtotal: true,
    discount_amount: true,
    total: true,
  }),
  items: z.array(createItemBudgetOutputSchema),
});
export type createBudgetOutputDTO = z.infer<typeof createBudgetOutputSchema>;

export const getBudgetByIdOutputSchema = z.object({
  budget: budgetSchema,
  items: z.array(itemSchema),
});
export type getBudgetByIdOutputDTO = z.infer<typeof getBudgetByIdOutputSchema>;

// --- UPDATE OUTPUTS
export const updateItemBudgetOutputSchema =
  createItemBudgetOutputSchema.partial();
  
export type updateItemBudgetOutputDTO = z.infer<
  typeof updateItemBudgetOutputSchema
>;

export const updateBudgetOutputSchema = createBudgetOutputSchema;
export type updateBudgetOutputDTO = z.infer<typeof updateBudgetOutputSchema>;
