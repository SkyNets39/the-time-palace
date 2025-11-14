import { createClient } from "@/app/_services/supabase/server";
import { ReservationDetail } from "@/app/_types";

//public
export async function getActiveReservation(userId: string, watchId: number) {
  const supabase = await createClient();
  const today = new Date().toLocaleDateString("en-CA");

  const { data, error } = await supabase
    .from("reservations")
    .select("id, reservation_date, status")
    .eq("user_id", userId)
    .eq("watch_id", watchId)
    .in("status", ["pending", "confirmed"])
    .gte("reservation_date", today)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching reservation:", error.message);
    return null;
  }

  return data;
}

//public
export async function getUserReservations(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
      id,
      watch_id,
      reservation_date,
      status,
      watch_listings (
        name,
        image
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching reservations:", error.message);
    return [];
  }

  // 🟢 Normalize: convert watch_listings array → single object
  const normalized =
    data?.map((res) => ({
      ...res,
      watch_listings: Array.isArray(res.watch_listings)
        ? res.watch_listings[0] // ambil watch pertama aja
        : res.watch_listings,
    })) ?? [];

  return normalized;
}

//public
export async function getReservationDetail(
  reservationId: number
): Promise<ReservationDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
        id,
        watch_id,
        full_name,
        phone,
        reservation_date,
        status,
        created_at,
        watch_listings (
        id,
          name,
          image,
          condition,
          price,
          store
        )
      `
    )
    .eq("id", reservationId)
    .single();

  if (error) {
    console.error("Error fetching reservation detail:", error.message);
    return null;
  }

  // ✅ Normalize watch data
  const watch = Array.isArray(data.watch_listings)
    ? data.watch_listings[0]
    : data.watch_listings;

  // ✅ Fetch store info if available
  let store = null;
  if (watch?.store) {
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("id, name, address, phone, open_days, open_hours")
      .eq("id", watch.store)
      .single();

    if (!storeError) {
      store = storeData;
    }
  }

  return {
    id: data.id,
    watch_id: data.watch_id,
    full_name: data.full_name,
    phone: data.phone,
    reservation_date: data.reservation_date,
    status: data.status,
    created_at: data.created_at,
    watch,
    store,
  };
}
