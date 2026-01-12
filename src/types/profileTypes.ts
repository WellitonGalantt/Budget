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

export type createProfileInputDTO = {
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
};

export type createProfileOutputDTO = {
  id: string;
};
