import { PAGE_SIZE } from "@/app/_constants/variables";
import { createClient } from "@/app/_services/supabase/client";
import {
  ReservationDetail,
  ReservationPayload,
  ReservationRow,
  ReservationStatus,
} from "@/app/_types/reservation";

//public
export async function createReservation(data: ReservationPayload) {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("User not authenticated");

  const { error } = await supabase.from("reservations").insert([
    {
      user_id: userData.user.id,
      watch_id: data.watch_id,
      full_name: data.full_name,
      phone: data.phone,
      reservation_date: data.reservation_date,
      status: data.status ?? "pending",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw new Error(error.message);
  return { success: true };
}

//admin
export async function getAllReservations(
  statusFilter?: ReservationStatus[],
  sortBy?: "date-asc" | "date-desc",
  page = 1
): Promise<{ data: ReservationRow[]; count: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("reservations")
    .select(
      "id, watch_id, full_name, phone, reservation_date, status, created_at, cancel_reason",
      { count: "exact" }
    );

  if (statusFilter?.length) query = query.in("status", statusFilter);

  if (sortBy === "date-asc")
    query = query.order("reservation_date", { ascending: true });
  else query = query.order("reservation_date", { ascending: false });

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return { data: data ?? [], count: count ?? 0 };
}

//admin
export async function getReservationById(
  reservationId: number
): Promise<ReservationDetail> {
  const supabase = await createClient();

  // Main reservation
  const { data: reservation, error: resErr } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .single();

  if (resErr) throw new Error(resErr.message);
  if (!reservation) throw new Error("Reservation not found");

  // Watch detail
  const { data: watch, error: watchErr } = await supabase
    .from("watch_listings")
    .select("id, name, brand, price, image, condition, status")
    .eq("id", reservation.watch_id)
    .maybeSingle();

  if (watchErr) throw new Error(watchErr.message);

  // Active reservation count
  const { count } = await supabase
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("watch_id", reservation.watch_id)
    .in("status", ["pending", "confirmed"]);

  return {
    ...reservation,
    watch: watch ?? null,
    active_reservations_count: count ?? 0,
  };
}

//admin
export async function updateReservation(
  id: number,
  payload: {
    status: "pending" | "confirmed" | "canceled";
    cancel_reason?: string | null;
  }
): Promise<ReservationRow> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reservations")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ReservationRow;
}
