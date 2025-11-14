export type FilterOptions = {
  brands: string[];
  years: number[];
  priceRange: { min: number; max: number };
};

export type AdminWatchFilters = {
  brand?: string[];
  condition?: string[];
  status?: string[];
};
