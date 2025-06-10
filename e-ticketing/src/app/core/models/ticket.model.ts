export interface GroupedTicket {
  price: number;
  type: TicketType;
  is_vip: boolean;
  title: string;
  description: string;
  place: string;
  sale_id: number;
  event_id: number;
  total_amount: number;
  available_amount: number;
  sold_amount: number;
  held_amount: number;
}

export interface CreateTicketRequest {
  price: number;
  type: TicketType;
  is_vip: boolean;
  title: string;
  description: string;
  place: string;
  sale_id: number;
  event_id: number;
  amount: number;
}

export interface UpdateTicketRequest {
  old_ticket: GroupedTicket;
  updates: {
    price?: number;
    type?: TicketType;
    is_vip?: boolean;
    title?: string;
    description?: string;
    place?: string;
    sale_id?: number;
  };
}

export enum TicketType {
  REGULAR = 1,
  VIP = 2,
  PREMIUM = 3
}

export function getTicketTypeText(type: TicketType): string {
  switch (type) {
    case TicketType.REGULAR: return 'Regular';
    case TicketType.VIP: return 'VIP';
    case TicketType.PREMIUM: return 'Premium';
    default: return 'Unknown';
  }
}