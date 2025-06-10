export interface PaymentMethodData {
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  card_holder?: string;
  paypal_email?: string;
  google_email?: string;
}

export interface CreatePaymentMethodRequest {
  type: PaymentType;
  payment_data: PaymentMethodData;
  is_default?: boolean;
}

export interface PaymentMethod {
  id: number;
  type: PaymentType;
  type_name: string;
  masked_data: { [key: string]: string };
  token: string;
  is_default: boolean;
  nickname?: string;
}

export enum PaymentType {
  CARD = 1,
  PAYPAL = 2,
  GOOGLE_PAY = 3,
  STRIPE = 4
}