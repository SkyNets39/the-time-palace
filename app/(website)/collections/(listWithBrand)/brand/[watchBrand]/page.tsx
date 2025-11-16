import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";

import Loading from "@/app/_components/UI/Loading";
import CardCatalogList from "@/app/_components/features/collections/CatalogCardList";
import Pagination from "@/app/_components/UI/Pagination";

import BrandStory from "@/app/_components/features/collections/BrandStory";
import CatalogHeader from "@/app/_components/features/collections/CatalogHeader";
import type { SortOption } from "@/app/_types/sort";
import { WatchListing } from "@/app/_types";
import { getAvailableWatchListings } from "@/app/_services/apiWatchListings/server";

type Props = {
  params: Promise<{ watchBrand: string }>;
  searchParams: Promise<{
    year?: string;
    priceMin?: string;
    priceMax?: string;
    page?: string;
    sortBy?: string; // ✅ tambahkan supaya bisa baca sort param
  }>;
};

// export async function generateStaticParams() {
//   const brands = await getAllUniqueBrands();

//   return brands.map((brand) => ({
//     watchBrand: slugify(brand),
//   }));
// }

export default async function BrandPage({ params, searchParams }: Props) {
  const { watchBrand } = await params;
  const query = await searchParams;

  const page = query.page ? parseInt(query.page, 10) : 1;
  const limit = 9;
  const sortBy = (query.sortBy as SortOption) ?? "alpha-asc"; // ✅ tambahkan

  const filters = {
    brand: watchBrand,
    year: query.year ? Number(query.year) : undefined,
    priceMin: query.priceMin ? Number(query.priceMin) : undefined,
    priceMax: query.priceMax ? Number(query.priceMax) : undefined,
  };

  const { data, total } = await getAvailableWatchListings(filters, page, limit);

  // ✅ Tambahkan logic sorting (copy dari collection page)
  const sortedData = [...(data ?? [])];
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
      sortedData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  return (
    <>
      <BrandStory brand={watchBrand} />
      <CatalogHeader brand={watchBrand} />
      {!sortedData || sortedData.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No watches found for {watchBrand}
          </Typography>
        </Box>
      ) : (
        <Suspense fallback={<Loading />}>
          <CardCatalogList data={sortedData as WatchListing[]} />
        </Suspense>
      )}

      <Pagination
        total={total}
        currentPage={page}
        limit={limit}
        route={`/collections/brand/${watchBrand}`}
      />
    </>
  );
}
