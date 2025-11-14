export type OrderItem = {
  watch_id: number;
  watch_name: string;
  price: number;
  image: string;
};

export type Order = {
  order_id: number;
  reservation_id: number | null;
  customer_name: string;
  customer_email: string;
  phone: string | null;
  amount: number;
  warranty_expired_at: string | null;
  status: "completed" | "refunded";
  created_at: string;
  updated_at: string;
  items: OrderItem[] | null;
};

export type OrderSortOption =
  | "date-asc"
  | "date-desc"
  | "amount-asc"
  | "amount-desc";

export type OrderFilters = {
  status?: string[]; // e.g. ['completed', 'refunded']
};
