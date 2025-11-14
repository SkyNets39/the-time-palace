import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

//public
export async function getServerSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null; // unauthenticated
  return data.user;
}

//public
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signup");
  }

  return user;
}

//public
export async function requireReservationOwner(reservationId: number) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Ambil reservasi untuk cek kepemilikan
  const { data: reservation, error } = await supabase
    .from("reservations")
    .select("id, user_id")
    .eq("id", reservationId)
    .single();

  console.log(reservation);

  if (error || !reservation) {
    redirect("/not-found"); // atau notFound();
  }

  // Cek apakah user ini pemiliknya
  if (reservation.user_id !== user.id) {
    redirect("/about");
  }

  return user; // return user kalau dia memang owner
}
