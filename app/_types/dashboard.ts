export type DashboardPeriod = "7d" | "30d" | "90d";

export type TrendingWatch = {
  id: number;
  name: string;
  brand: string;
  totalReservations: number;
};

export type DashboardStats = {
  totalSales: number;
  totalOrders: number;
  newUsers: number;
};

export type TopBrandSales = {
  brand: string;
  totalSold: number;
};

export type RevenueBrand = {
  brand: string;
  completedRevenue: number;
  activeReservationRevenue: number;
};

export type OrderItemRow = {
  watch_listings?: { brand?: string; price?: number | string } | null;
  orders?: { status?: string; created_at?: string } | null;
};

export type WatchListingRow = {
  id: number;
  brand?: string | null;
  price?: number | string | null;
};

export type ReservationRowDashboard = {
  watch_id: number;
  created_at: string;
  watch_listings?: { name?: string | null; brand?: string | null } | null;
};
