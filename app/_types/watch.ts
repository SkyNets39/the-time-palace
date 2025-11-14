export type WatchListing = FormData & {
  id: number;
  created_at: string;
  brand: string;
  name: string;
  price: number;
  status: string;
  year?: number | null;
  image?: string | null;
  description?: string | null;
  with_box?: boolean;
  condition?: string | undefined;
  gender?: string | null;
  size?: number | null;
  store?: number | null;
};

export type Filter = {
  brand?: string;
  year?: number;
  priceMin?: number;
  priceMax?: number;
};

export type ListingRow = {
  id: number;
  name: string;
  brand?: string;
  price?: number | null;
  condition?: string | null;
  status?: string | null;
  image?: string | null;
  [key: string]: unknown;
};
