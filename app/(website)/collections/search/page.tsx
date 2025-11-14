import { Suspense } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "@/app/_components/UI/Loading";
import CardCatalogList from "@/app/_components/features/collections/CatalogCardList";
import Pagination from "@/app/_components/UI/Pagination";
import Filter from "@/app/_components/layout/Filter";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import CatalogHeader from "@/app/_components/features/collections/CatalogHeader";

import type { SortOption, WatchListing } from "@/app/_types";
import {
  getFilterOptionsForSearch,
  getSearchWatchListings,
} from "@/app/_services/apiWatchListings/server";

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    brand?: string;
    year?: string;
    priceMin?: string;
    priceMax?: string;
    sortBy?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: Props) {
  const query = await searchParams;
  const keyword = query.q ?? "";
  const page = query.page ? parseInt(query.page, 10) : 1;
  const limit = 12;
  const sortBy = (query.sortBy as SortOption) ?? "newest";

  // ✅ Build filters
  const filters = {
    brand: query.brand ?? undefined,
    year: query.year ? Number(query.year) : undefined,
    priceMin: query.priceMin ? Number(query.priceMin) : undefined,
    priceMax: query.priceMax ? Number(query.priceMax) : undefined,
  };

  if (!keyword.trim()) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Please enter a search term.
        </Typography>
      </Box>
    );
  }

  // ✅ Fetch raw data & filter options concurrently (no sorting in Supabase)
  const [{ data, total }, filterOptions] = await Promise.all([
    getSearchWatchListings(keyword, page, limit, filters),
    getFilterOptionsForSearch(keyword),
  ]);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          No results found
        </Typography>
      </Box>
    );
  }

  // ✅ Apply sorting logic here (same as /collections/page.tsx)
  const sortedData = [...data];
  switch (sortBy) {
    case "newest":
      sortedData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "oldest":
      sortedData.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      break;
    case "price-asc":
      sortedData.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sortedData.sort((a, b) => b.price - a.price);
      break;
    case "alpha-asc":
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "alpha-desc":
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // Default ke newest (by created_at)
      sortedData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  return (
    <Box sx={{ mx: 8, display: "flex", flexDirection: "column", gap: 2 }}>
      <Breadcrumbs />

      <Box sx={{ display: "flex", gap: 8 }}>
        {/* Sidebar filter */}
        <Box sx={{ flex: "0 0 20%" }}>
          <Filter options={filterOptions} />
        </Box>

        {/* Search results */}
        <Box sx={{ flex: 1 }}>
          <CatalogHeader headerText={`Products for "${keyword}"`} />

          <Suspense fallback={<Loading />}>
            <CardCatalogList data={sortedData as WatchListing[]} />
          </Suspense>

          <Pagination
            total={total}
            currentPage={page}
            limit={limit}
            route={`/collections/search?q=${encodeURIComponent(keyword)}`}
          />
        </Box>
      </Box>
    </Box>
  );
}
