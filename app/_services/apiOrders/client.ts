import { PAGE_SIZE } from "@/app/_constants/variables";
import { Order, OrderFilters, OrderSortOption } from "@/app/_types/order";
import { createClient } from "../supabase/client";

type CreateOrderPayload = {
  reservation_id?: number | null;
  customer_name: string;
  customer_email: string;
  phone: string;
  warranty: boolean;
  watch_ids: number[];
};

export async function getOrders(
  filters?: OrderFilters,
  sortBy?: OrderSortOption,
  page = 1,
  keyword?: string
) {
  const supabase = await createClient();

  let query = supabase.from("orders_view").select(
    "order_id, customer_name, customer_email, phone, amount, status, created_at",
    { count: "exact" } // ✅ penting untuk pagination
  );

  // ✅ Keyword search (by name or email)
  if (keyword && keyword.trim().length >= 2) {
    query = query.or(
      `customer_name.ilike.%${keyword}%,customer_email.ilike.%${keyword}%`
    );
  }

  // ✅ Filter by status
  if (filters?.status?.length) {
    const filtered = filters.status.includes("all")
      ? [] // "all" berarti tanpa filter
      : filters.status;
    if (filtered.length) query = query.in("status", filtered);
  }

  // ✅ Sorting logic
  if (sortBy) {
    switch (sortBy) {
      case "date-desc":
        query = query.order("created_at", { ascending: false });
        break;
      case "date-asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "amount-desc":
        query = query.order("amount", { ascending: false });
        break;
      case "amount-asc":
        query = query.order("amount", { ascending: true });
        break;
    }
  } else {
    // default sorting (newest first)
    query = query.order("created_at", { ascending: false });
  }

  // ✅ Pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  // ✅ Execute query
  const { data, count, error } = await query;

  if (error) {
    console.error(error.message);
    throw new Error("Failed to load orders");
  }

  return { data: data ?? [], count: count ?? 0 };
}

export const getOrderById = async (orderId: number): Promise<Order> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders_view")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Order not found");
  return data as Order;
};

export const updateOrderStatus = async (
  orderId: number,
  status: "completed" | "refunded"
): Promise<void> => {
  const supabase = await createClient();

  console.log("🟡 [updateOrderStatus] Triggered:", { orderId, status });

  // 1️⃣ Update status di tabel orders
  const { error: orderError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (orderError) {
    console.error("❌ Failed to update order:", orderError.message);
    throw new Error(orderError.message);
  }

  console.log("✅ Order status updated:", { orderId, newStatus: status });

  // 2️⃣ Kalau status refund, rollback semua watch ke status pending
  if (status === "refunded") {
    console.log("🔍 [Refund Triggered] Order ID:", orderId);

    // Ambil semua item yang termasuk dalam order ini
    const { data: items, error: itemError } = await supabase
      .from("order_items")
      .select("order_id, watch_id")
      .eq("order_id", orderId);

    if (itemError) {
      console.error("❌ Failed to fetch order_items:", itemError.message);
      throw new Error(itemError.message);
    }

    console.log("📦 Found order_items:", items);

    // Ambil semua watch_id dan convert ke number biar aman dari bigint/string mismatch
    const watchIds = items?.map((i) => Number(i.watch_id)) ?? [];
    console.log("⌚ Watch IDs to update:", watchIds);

    // Kalau gak ada watch_ids, hentikan proses
    if (!watchIds.length) {
      console.warn("⚠️ No watch_ids found for order:", orderId);
      return;
    }

    // Update semua watch jadi pending (atau 'available' kalau enum DB-nya beda)
    const { data: updatedWatches, error: watchError } = await supabase
      .from("watch_listings")
      .update({ status: "pending" }) // 🔁 Ganti ke 'available' kalau DB-mu gak punya 'pending'
      .in("id", watchIds)
      .select("id, status");

    if (watchError) {
      console.error("❌ Failed to update watch_listings:", watchError.message);
      throw new Error(watchError.message);
    }

    console.log("✅ Updated watches:", updatedWatches);
  }

  console.log("🟢 [updateOrderStatus] Completed successfully.");
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<number> => {
  const supabase = await createClient();

  // Ambil harga jam
  const { data: selectedWatches, error: watchError } = await supabase
    .from("watch_listings")
    .select("id, price")
    .in("id", payload.watch_ids);

  if (watchError || !selectedWatches) {
    throw new Error(watchError?.message || "Failed to fetch watch prices");
  }

  // Hitung total
  const subTotal = selectedWatches.reduce((sum, w) => sum + Number(w.price), 0);
  const warrantyCost = payload.warranty ? subTotal * 0.05 : 0;
  const totalAmount = subTotal + warrantyCost;

  const warrantyExpiredAt = payload.warranty
    ? new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  // Insert ke orders
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: payload.customer_name,
      customer_email: payload.customer_email,
      phone: payload.phone,
      amount: totalAmount,
      warranty_expired_at: warrantyExpiredAt,
      status: "completed",
    })
    .select("id")
    .single();

  if (orderError || !orderData)
    throw new Error(orderError?.message || "Failed to create order");

  const orderId = orderData.id;

  // Insert order_items
  const orderItems = selectedWatches.map((watch) => ({
    order_id: orderId,
    watch_id: watch.id,
    price: Number(watch.price),
  }));

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemError) throw new Error(itemError.message);

  // Update watch status
  const { error: updateWatchError } = await supabase
    .from("watch_listings")
    .update({ status: "sold" })
    .in("id", payload.watch_ids);

  if (updateWatchError) throw new Error(updateWatchError.message);

  return orderId;
};
