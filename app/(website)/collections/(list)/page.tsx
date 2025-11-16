// app/collections/page.tsx
import Loading from "@/app/_components/UI/Loading";
import CardCatalogList from "@/app/_components/features/collections/CatalogCardList";
import CatalogHeader from "@/app/_components/features/collections/CatalogHeader";
import Pagination from "@/app/_components/UI/Pagination";
import type { SortOption } from "@/app/_types/sort";
import { Suspense } from "react";
import { WatchListing } from "@/app/_types";
import { getAvailableWatchListings } from "@/app/_services/apiWatchListings/server";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>; // ← Change to Promise
};

export const revalidate = 300;

export default async function Page(props: Props) {
  // ← Await searchParams
  const searchParams = await props.searchParams;

  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 9;

  const filters = {
    brand: searchParams.brand,
    year: searchParams.year ? Number(searchParams.year) : undefined,
    priceMin: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
    priceMax: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
  };

  const sortBy = (searchParams.sortBy as SortOption) ?? "alpha-asc";

  // Add console.log to debug
  console.log("Current page:", page);
  console.log("Filters:", filters);

  const { data, total } = await getAvailableWatchListings(filters, page, limit);

  if (!data || data.length === 0) {
    return <div>No watches found</div>;
  }

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
    <div>
      <CatalogHeader />
      <Suspense fallback={<Loading />}>
        <CardCatalogList data={sortedData as WatchListing[]} />
      </Suspense>

      <Pagination
        total={total}
        currentPage={page}
        limit={limit}
        route="/collections/"
      />
    </div>
  );
}
