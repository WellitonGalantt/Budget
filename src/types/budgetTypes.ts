export type budget = {
  id: string;
  user_id: string;
  client_id: string;
  public_id: string;
  status: string;
  title: string;
  notes: string | null;
  valid_until: Date | null;
  currency: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  created_at: Date;
  updated_at: Date;
};

export type item = {
  id: String;
  budget_id: String;
  service_id: String | null;
  name: String;
  description: String | null;
  unit: String;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
  created_at: Date;
};

export type statusBudget =
  | `draft`
  | `sent`
  | `approved`
  | `rejected`
  | `canceled`;

export type valueUnit = "vl" | "hr" | "un";

export type createBudgetInputDTO = {
  budget: {
    client_id: string;
    status: string;
    title: string;
    notes: string;
    valid_until: Date;
    currency: string;
    subtotal: number;
    discount_amount: number;
    total: number;
  };
  items: createItemBudgetInputDTO[];
};

export type createItemBudgetInputDTO = {
  budget_id: string;
  service_id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
};

export type createBudgetOutputDTO = {
  budget: {
    id: string;
    client_id: string;
    status: string;
    title: string;
    valid_until: Date;
    currency: string;
    subtotal: number;
    discount_amount: number;
    total: number;
  };
  items: createItemBudgetOutputDTO[];
};

export type createItemBudgetOutputDTO = {
  budget_id: string;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
};

// ===== UPDATE

export type updateBudgetInputDTO = Partial<{
  client_id: string;
  status: string;
  title: string;
  notes: string;
  valid_until: Date;
  currency: string;
  discount_amount: number;
}>;

export type updateItemBudgetOutputDTO = Partial<{
  budget_id: string;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
}>;

export type updateBudgetOutputDTO = {
  budget: {
    id: string;
    client_id: string;
    status: string;
    title: string;
    valid_until: Date | null;
    currency: string;
    subtotal: number;
    discount_amount: number;
    total: number;
  };
  items: updateItemBudgetOutputDTO[];
};

// ===== GET BY ID

export type getBudgetByIdOutputDTO = {
  budget: budget;
  items: item[];
};
