export type ReservationStatus = "pending" | "confirmed" | "canceled" | string;

export type ReservationPayload = {
  watch_id: number;
  full_name: string;
  phone: string;
  reservation_date: string;
  status?: string;
};

export type ReservationRow = {
  id: number;
  watch_id: number;
  full_name: string | null;
  phone: string | null;
  reservation_date: string | null; // ISO date
  status: "pending" | "confirmed" | "canceled";
  created_at?: string | null;
  cancel_reason?: string | null;
};

export type ReservationDetail = {
  id: number;
  watch_id: number;
  full_name: string;
  phone: string;
  reservation_date: string;
  status: string;
  created_at: string;
  cancel_reason?: string | null; //
  watch?: {
    id: number; //
    name: string;
    brand?: string | null; //
    image: string | null;
    condition: string | null;
    price: number;
    store?: number | null;
    status?: string | null; //
  } | null;
  store?: {
    id: number;
    name: string;
    address: string;
    phone: string;
    open_days: string;
    open_hours: string;
  } | null;
  active_reservations_count?: number;
};
