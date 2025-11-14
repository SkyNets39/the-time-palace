import { createClient } from "@/app/_services/supabase/server";
import { Filter, FilterOptions, WatchListing } from "@/app/_types";
import { createSearchPattern } from "@/app/_utils/searchUtils";

//public
export async function getFilterOptions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("watch_listings")
    .select("brand, year, price");

  if (error || !data) {
    console.error("getFilterOptions error:", error?.message);
    return {
      brands: [] as string[],
      years: [] as (number | string)[],
      priceRange: { min: 0, max: 0 },
    };
  }

  // Ensure proper typing
  const brands = Array.from(
    new Set(
      data
        .map((r: { brand: string | null }) => r.brand ?? "")
        .filter((b): b is string => b.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const years = Array.from(
    new Set(
      data
        .map((r: { year: number | null }) => r.year)
        .filter((y): y is number => y !== null && !Number.isNaN(y))
    )
  ).sort((a, b) => b - a);

  const prices = data
    .map((r: { price: number | null }) => Number(r.price))
    .filter((p) => !Number.isNaN(p));

  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return {
    brands,
    years,
    priceRange: { min, max },
  };
}

//public
export async function getFilterOptionsForBrand(brand: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("watch_listings")
    .select("brand, year, price")
    .eq("status", "available")
    .eq("brand", brand); // ⬅️ hanya ambil jam dari brand ini

  if (error || !data) {
    console.error("getFilterOptionsForBrand error:", error?.message);
    return {
      brands: [brand], // cuma 1 brand
      years: [],
      priceRange: { min: 0, max: 0 },
    };
  }

  // 🔹 Extract proper brand data
  const years = Array.from(
    new Set(
      data
        .map((r: { year: number | null }) => r.year)
        .filter((y): y is number => y !== null && !Number.isNaN(y))
    )
  ).sort((a, b) => b - a);

  const prices = data
    .map((r: { price: number | null }) => Number(r.price))
    .filter((p) => !Number.isNaN(p));

  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return {
    brands: [brand],
    years,
    priceRange: { min, max },
  };
}

//public
export async function getFilterOptionsForSearch(
  keyword: string
): Promise<FilterOptions> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("watch_listings")
    .select("brand, year, price")
    .eq("status", "available")
    .or(
      `brand.ilike.%${keyword}%,name.ilike.%${keyword}%,description.ilike.%${keyword}%`
    );

  if (error || !data) {
    console.error("getFilterOptionsForSearch error:", error?.message);
    return {
      brands: [],
      years: [] as number[],
      priceRange: { min: 0, max: 0 },
    };
  }

  const brands = Array.from(
    new Set(
      data
        .map((r: { brand: string | null }) => r.brand ?? "")
        .filter((b): b is string => b.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const years = Array.from(
    new Set(
      data
        .map((r: { year: number | string | null }) =>
          r.year !== null ? Number(r.year) : null
        )
        .filter((y): y is number => typeof y === "number" && !Number.isNaN(y))
    )
  ).sort((a, b) => b - a);

  const prices = data
    .map((r: { price: number | null }) => Number(r.price))
    .filter((p) => !Number.isNaN(p));

  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return {
    brands,
    years,
    priceRange: { min, max },
  };
}

//public
export async function getAvailableWatchListings(
  filters?: Filter,
  page = 1,
  limit = 12
): Promise<{ data: WatchListing[]; total: number }> {
  const supabase = await createClient();

  // Calculate range
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("watch_listings")
    .select("*", { count: "exact" })
    .eq("status", "available");

  if (filters?.brand) query = query.eq("brand", filters.brand);
  if (filters?.year) query = query.eq("year", filters.year);
  if (typeof filters?.priceMin === "number")
    query = query.gte("price", filters.priceMin);
  if (typeof filters?.priceMax === "number")
    query = query.lte("price", filters.priceMax);

  // Apply pagination range
  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching listings:", error.message);
    return { data: [], total: 0 };
  }

  return { data: data ?? [], total: count ?? 0 };
}

//public
export async function getWatchListing(
  id: number
): Promise<WatchListing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watch_listings")
    .select("*")
    .eq("id", id)
    .single(); // ⬅ returns a single object instead of array

  if (error) {
    console.error("Error fetching listing:", error.message);
    return null;
  }

  return data;
}

//public
export async function getSearchWatchListings(
  keyword: string,
  page = 1,
  limit = 12,
  filters?: Filter
): Promise<{ data: WatchListing[]; total: number }> {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // ✅ buat search pattern fleksibel
  const pattern = createSearchPattern(keyword); // “vacheron constantine cons” → “vacheron%constantine%cons”

  let query = supabase
    .from("watch_listings")
    .select("*", { count: "exact" })
    .eq("status", "available")
    .or(
      `brand.ilike.%${pattern}%,name.ilike.%${pattern}%,description.ilike.%${pattern}%`
    );

  // ✅ Apply filters
  if (filters?.brand) query = query.eq("brand", filters.brand);
  if (filters?.year) query = query.eq("year", filters.year);
  if (typeof filters?.priceMin === "number")
    query = query.gte("price", filters.priceMin);
  if (typeof filters?.priceMax === "number")
    query = query.lte("price", filters.priceMax);

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching search listings:", error.message);
    return { data: [], total: 0 };
  }

  return { data: data ?? [], total: count ?? 0 };
}
