export interface Sale {
  id: number;
  start_date: number; // Unix timestamp
  end_date: number;   // Unix timestamp
  event_id: number;
  is_active: boolean;
  event_info?: {
    title: string;
    description: string;
    date: number;
    address: string;
  };
}

export interface CreateSaleRequest {
  start_date: number;
  end_date: number;
  event_id: number;
}

export interface UpdateSaleRequest {
  start_date?: number;
  end_date?: number;
}