import { Store, StoreOption } from "@/app/_types";
import { PAGE_SIZE } from "@/app/_constants/variables";
import { createClient } from "../supabase/client";

//admin
export async function getStoreNames(): Promise<StoreOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("getStoreNames error:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []) as StoreOption[];
}

//admin
export async function getStores(page = 1) {
  const supabase = await createClient();

  let query = supabase
    .from("stores")
    .select("id, name, address, open_days, open_hours, phone", {
      count: "exact",
    })
    .order("id", { ascending: true }); // default sort by ID

  // pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Failed to load stores:", error.message);
    throw new Error(error.message);
  }

  return { data: data ?? [], count: count ?? 0 };
}

//admin
export async function getStoreById(id: number): Promise<Store> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Store;
}

//admin
export async function updateStore(
  id: number,
  updates: Partial<Omit<Store, "id">>
): Promise<Store> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Store;
}
