import { createClient } from "@/app/_services/supabase/server";
import { Store } from "@/app/_types";

//public
export async function getStore(id: number): Promise<Store | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching store name:", error.message);
    return null;
  }

  return data;
}

//public
export async function getStores(): Promise<Store[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stores")
    .select("id, name, address, open_days, open_hours, phone")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching stores:", error.message);
    return [];
  }

  return data ?? [];
}
