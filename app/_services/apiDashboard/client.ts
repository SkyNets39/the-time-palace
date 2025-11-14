import { formatDisplayName } from "@/app/_utils/searchUtils";
import { createClient } from "../supabase/client";
import {
  DashboardPeriod,
  DashboardStats,
  OrderItemRow,
  ReservationRowDashboard,
  RevenueBrand,
  TopBrandSales,
  TrendingWatch,
  WatchListingRow,
} from "@/app/_types";

export async function getDashboardStats(
  period: DashboardPeriod
): Promise<DashboardStats> {
  const supabase = await createClient();

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
  }

  const startISOString = startDate.toISOString();

  // ✅ Total Sales & Orders (from orders_view)
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders_view")
    .select("amount, order_id")
    .gte("created_at", startISOString);

  if (ordersError) throw new Error(ordersError.message);

  const totalSales =
    ordersData?.reduce(
      (sum, order) => sum + Number(order.amount ?? 0), // 🟢 safer number conversion
      0
    ) ?? 0;
  const totalOrders = ordersData?.length ?? 0;

  // ✅ New Users (from profiles table where role === 'user')
  const { count: newUsers, error: userError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", startISOString);

  if (userError) throw new Error(userError.message);

  return {
    totalSales,
    totalOrders,
    newUsers: newUsers ?? 0,
  };
}

export async function getTopBrandSales(
  period: DashboardPeriod
): Promise<TopBrandSales[]> {
  const supabase = await createClient();

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
  }

  const startISOString = startDate.toISOString();

  const { data, error } = await supabase
    .from("order_items")
    .select("watch_listings(brand), orders!inner(status, created_at)")
    .gte("orders.created_at", startISOString)
    .eq("orders.status", "completed");

  if (error) throw new Error(error.message);

  // 🟢 Explicitly typed data iteration
  const brandCount: Record<string, number> = {};

  (data as OrderItemRow[] | null)?.forEach((item) => {
    const brand =
      formatDisplayName(item.watch_listings?.brand ?? "") || "Unknown";
    brandCount[brand] = (brandCount[brand] || 0) + 1;
  });

  const result: TopBrandSales[] = Object.entries(brandCount).map(
    ([brand, totalSold]) => ({
      brand,
      totalSold,
    })
  );

  result.sort((a, b) => b.totalSold - a.totalSold);

  return result;
}

export async function getRevenuePerBrand(
  period: DashboardPeriod
): Promise<RevenueBrand[]> {
  const supabase = await createClient();

  const now = new Date();
  const start = new Date();
  switch (period) {
    case "7d":
      start.setDate(now.getDate() - 7);
      break;
    case "30d":
      start.setDate(now.getDate() - 30);
      break;
    case "90d":
      start.setDate(now.getDate() - 90);
      break;
  }
  const startISOString = start.toISOString();

  // ---- 1️⃣ Completed Revenue ----
  const { data: completedData, error: completedError } = await supabase
    .from("order_items")
    .select("watch_listings (brand, price), orders!inner (status, created_at)")
    .gte("orders.created_at", startISOString)
    .eq("orders.status", "completed");

  if (completedError) throw new Error(completedError.message);

  const completedMap = new Map<string, number>();
  (completedData as OrderItemRow[] | null)?.forEach((item) => {
    const brand = item.watch_listings?.brand;
    const price = Number(item.watch_listings?.price ?? 0);
    if (brand) completedMap.set(brand, (completedMap.get(brand) || 0) + price);
  });

  // ---- 2️⃣ Active Reservation Revenue ----
  const { data: reservationIds } = await supabase
    .from("reservations")
    .select("watch_id")
    .in("status", ["pending", "confirmed"])
    .gte("created_at", startISOString);

  const activeWatchIds =
    reservationIds?.map((r: { watch_id: number }) => r.watch_id) ?? [];

  const { data: activeData, error: activeError } = await supabase
    .from("watch_listings")
    .select("brand, price, id")
    .in("id", activeWatchIds);

  if (activeError) throw new Error(activeError.message);

  const activeMap = new Map<string, number>();
  (activeData as WatchListingRow[] | null)?.forEach((item) => {
    const brand = item.brand;
    const price = Number(item.price ?? 0);
    if (brand) activeMap.set(brand, (activeMap.get(brand) || 0) + price);
  });

  // ---- 3️⃣ Combine Results ----
  const allBrands = new Set([...completedMap.keys(), ...activeMap.keys()]);
  const result: RevenueBrand[] = Array.from(allBrands).map((brand) => ({
    brand,
    completedRevenue: completedMap.get(brand) || 0,
    activeReservationRevenue: activeMap.get(brand) || 0,
  }));

  return result;
}

export async function getTopTrendingWatches(
  period: DashboardPeriod
): Promise<TrendingWatch[]> {
  const supabase = await createClient();

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
  }

  const startISOString = startDate.toISOString();

  const { data, error } = await supabase
    .from("reservations")
    .select("watch_id, created_at, watch_listings(name, brand)")
    .gte("created_at", startISOString);

  if (error) throw new Error(error.message);

  const watchMap: Record<
    number,
    { name: string; brand: string; total: number }
  > = {};

  (data as ReservationRowDashboard[] | null)?.forEach((r) => {
    const id = r.watch_id;
    const name = r.watch_listings?.name || "Unknown";
    const brand = r.watch_listings?.brand || "Unknown";

    if (!watchMap[id]) watchMap[id] = { name, brand, total: 0 };
    watchMap[id].total += 1;
  });

  const sorted = Object.entries(watchMap)
    .map(([id, val]) => ({
      id: Number(id),
      name: val.name,
      brand: val.brand,
      totalReservations: val.total,
    }))
    .sort((a, b) => b.totalReservations - a.totalReservations)
    .slice(0, 10);

  return sorted;
}
