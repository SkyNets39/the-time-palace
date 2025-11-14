import { PAGE_SIZE } from "@/app/_constants/variables";
import { createClient } from "@/app/_services/supabase/client";
import { AdminWatchFilters, SortOption } from "@/app/_types";

//admin
export async function getAllBrands(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("watch_listings").select("brand");

  if (error) throw new Error(error.message);
  if (!data) return [];

  // return unique brand names
  return Array.from(new Set(data.map((d) => d.brand).filter(Boolean)));
}

export async function getAvailableWatchListings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("watch_listings")
    .select("id, name, brand, price, condition, image, status")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAvailableWatchListings error:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
}
//admin
export async function getAllWatchListings(
  filters?: AdminWatchFilters,
  sortBy?: SortOption,
  page = 1,
  keyword?: string
) {
  const supabase = await createClient();

  let query = supabase
    .from("watch_listings")
    .select("id, name, brand, price, condition, image, status, created_at", {
      count: "exact", // ✅ penting untuk pagination
    });

  // ✅ Filter search keyword
  if (keyword && keyword.trim().length >= 2) {
    query = query.ilike("name", `%${keyword}%`);
  }

  // ✅ Apply filters dynamically
  if (filters?.brand?.length) query = query.in("brand", filters.brand);
  if (filters?.condition?.length)
    query = query.in("condition", filters.condition);
  if (filters?.status?.length) query = query.in("status", filters.status);

  // ✅ Apply sorting logic
  if (sortBy) {
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "alpha-asc":
        query = query.order("name", { ascending: true });
        break;
      case "alpha-desc":
        query = query.order("name", { ascending: false });
        break;
    }
  }

  // ✅ Apply pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error(error.message);
    throw new Error("Failed to load watch listings");
  }

  return { data: data ?? [], count: count ?? 0 };
}

//admin
export async function getWatchListingsByStore(
  storeId: number,
  filters?: AdminWatchFilters,
  sortBy?: SortOption,
  page = 1,
  keyword?: string
) {
  const supabase = await createClient();

  let query = supabase
    .from("watch_listings")
    .select(
      "id, name, brand, price, condition, image, status, created_at, store",
      {
        count: "exact",
      }
    )
    .eq("store", storeId); // filter by store

  // keyword
  if (keyword && keyword.trim().length >= 2) {
    query = query.ilike("name", `%${keyword}%`);
  }

  // apply filters (brand/condition/status) if provided
  if (filters?.brand?.length) query = query.in("brand", filters.brand);
  if (filters?.condition?.length)
    query = query.in("condition", filters.condition);
  if (filters?.status?.length) query = query.in("status", filters.status);

  // sort
  if (sortBy) {
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "alpha-asc":
        query = query.order("name", { ascending: true });
        break;
      case "alpha-desc":
        query = query.order("name", { ascending: false });
        break;
    }
  }

  // pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("getWatchListingsByStore error:", error.message);
    throw new Error(error.message);
  }

  return { data: data ?? [], count: count ?? 0 };
}

//public
export async function getSearchSuggestions(
  keyword: string,
  limit = 8
): Promise<{ id: number; name: string }[]> {
  if (keyword.trim().length < 2) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("watch_listings")
    .select("id, name")
    .ilike("name", `%${keyword}%`)
    .limit(limit);

  if (error) {
    console.error("Error fetching search suggestions:", error.message);
    return [];
  }

  return data ?? [];
}

//admin
export async function deleteWatchListing(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("watch_listings").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

//admin
export async function updateWatchListing(
  id: number,
  data: Partial<{
    name: string;
    brand: string;
    price: number;
    condition: string;
    status: string;
    imageFile?: File;
  }>
) {
  const supabase = await createClient();

  let imageUrl: string | undefined;

  // ✅ Optional image upload
  if (data.imageFile) {
    const file = data.imageFile;
    const fileName = `${encodeURIComponent(
      file.name.replace(/\s+/g, "-")
    )}-${Date.now()}`;

    //temporary log
    console.log("Uploading image:", {
      name: file.name,
      type: file.type,
      size: file.size,
      instanceofFile: file instanceof File,
    });

    const { data: upload, error: uploadError } = await supabase.storage
      .from("watch-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = await supabase.storage
      .from("watch-images")
      .getPublicUrl(upload.path);

    imageUrl = publicUrl.publicUrl;
  }

  const payload: Partial<Omit<typeof data, "imageFile">> & { image?: string } =
    {
      ...(data.name && { name: data.name }),
      ...(data.brand && { brand: data.brand }),
      ...(data.price && { price: data.price }),
      ...(data.condition && { condition: data.condition }),
      ...(data.status && { status: data.status }),
      ...(imageUrl && { image: imageUrl }),
    };

  const { error } = await supabase
    .from("watch_listings")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);

  return payload;
}

//admin
export async function createWatchListing(
  data: Partial<{
    name: string;
    brand: string;
    price: number;
    condition: string;
    status: string;
    description?: string | null;
    year?: number | null;
    size?: number | null;
    store?: number | null;
    gender?: string | null;
    with_box?: boolean | null;
    imageFile?: File;
  }>
) {
  const supabase = await createClient();

  let imageUrl: string | undefined;

  if (data.imageFile) {
    const file = data.imageFile;
    const safeName = `${encodeURIComponent(
      file.name.replace(/\s+/g, "-")
    )}-${Date.now()}`;
    const { data: upload, error: uploadError } = await supabase.storage
      .from("watch-images")
      .upload(safeName, file, { upsert: true });

    if (uploadError) {
      console.error("upload error:", uploadError.message);
      throw new Error(uploadError.message);
    }

    const { data: publicUrl } = await supabase.storage
      .from("watch-images")
      .getPublicUrl(upload.path);

    imageUrl = publicUrl.publicUrl;
  }

  const payload: Record<string, unknown> = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.brand !== undefined && { brand: data.brand }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.condition !== undefined && { condition: data.condition }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.year !== undefined && { year: data.year }),
    ...(data.size !== undefined && { size: data.size }),
    ...(data.store !== undefined && { store: data.store }),
    ...(data.gender !== undefined && { gender: data.gender }),
    ...(data.with_box !== undefined && { with_box: data.with_box }),
    ...(imageUrl && { image: imageUrl }),
  };

  const { data: inserted, error } = await supabase
    .from("watch_listings")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("createWatchListing error:", error.message);
    throw new Error(error.message);
  }

  return inserted as Record<string, unknown>;
}
