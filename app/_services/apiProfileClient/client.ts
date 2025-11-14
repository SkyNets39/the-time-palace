import { createClient } from "../supabase/client";

//public
export async function getProfileNameClient(
  userId: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data?.full_name ?? null;
}

//public
export async function getClientInfoClient(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("phone, address")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}
