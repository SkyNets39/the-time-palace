import { createClient } from "@/app/_services/supabase/server";

//public
export async function getProfileName(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile name:", error.message);
    return null;
  }

  return data?.full_name;
}

//public
export async function getClientInfo(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("phone, address")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching client info:", error.message);
    return null;
  }

  return data;
}
