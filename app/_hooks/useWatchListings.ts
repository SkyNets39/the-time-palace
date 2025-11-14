// src/app/_hooks/useWatchListings.ts
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";

import { AdminWatchFilters, SortOption } from "../_types";
import { useSearchParams } from "next/navigation";
import type { ListingRow, WatchListing } from "../_types";
import toast from "react-hot-toast";
import { PAGE_SIZE } from "../_constants/variables";
import {
  createWatchListing,
  deleteWatchListing,
  getAllBrands,
  getAllWatchListings,
  getAvailableWatchListings,
  getWatchListingsByStore,
  updateWatchListing,
} from "../_services/apiWatchListings/client";

type ListingsQueryResult = {
  data: WatchListing[];
  count: number;
};

export function useWatchListings(storeId?: number) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const brand = searchParams.get("brand");
  const condition = searchParams.get("condition");
  const status = searchParams.get("status");
  const sortBy = (searchParams.get("sortBy") as SortOption) || undefined;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const keyword = searchParams.get("q") || "";

  const filters: AdminWatchFilters = {
    brand: brand && brand !== "all" ? brand.split(",") : [],
    condition: condition && condition !== "all" ? condition.split(",") : [],
    status: status && status !== "all" ? status.split(",") : [],
  };

  const queryKey = storeId
    ? ["watch_listings_by_store", storeId, filters, sortBy, page, keyword]
    : ["watch_listings", filters, sortBy, page, keyword];

  const {
    data: { data: listings = [], count = 0 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () =>
      storeId
        ? getWatchListingsByStore(storeId, filters, sortBy, page, keyword)
        : getAllWatchListings(filters, sortBy, page, keyword),
  });

  // prefetch next/prev
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: storeId
        ? ["watch_listings_by_store", storeId, filters, sortBy, page + 1]
        : ["watch_listings", filters, sortBy, page + 1],
      queryFn: () =>
        storeId
          ? getWatchListingsByStore(storeId, filters, sortBy, page + 1, keyword)
          : getAllWatchListings(filters, sortBy, page + 1, keyword),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: storeId
        ? ["watch_listings_by_store", storeId, filters, sortBy, page - 1]
        : ["watch_listings", filters, sortBy, page - 1],
      queryFn: () =>
        storeId
          ? getWatchListingsByStore(storeId, filters, sortBy, page - 1, keyword)
          : getAllWatchListings(filters, sortBy, page - 1, keyword),
    });
  }

  return { listings, count, isLoading, error, page };
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    staleTime: 1000 * 60 * 120,
  });
}

export function useCreateWatchListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createWatchListing>[0]) =>
      createWatchListing(data),

    onMutate: async (newData) => {
      await qc.cancelQueries({ queryKey: ["watch_listings"] });

      // 🟢 FIX: getQueriesData always returns [queryKey, unknown][]
      // jadi kita beri tipe manual untuk isi datanya
      const previous = qc.getQueriesData<{ data: ListingRow[]; count: number }>(
        {
          queryKey: ["watch_listings"],
        }
      );

      const tempId = Date.now() * -1;

      previous.forEach(([key]) => {
        // 🟢 FIX: tambahkan tipe eksplisit di callback
        qc.setQueryData<{ data: ListingRow[]; count: number }>(key, (old) => {
          if (!old || !old.data) return old;

          const appended: ListingRow = {
            id: tempId,
            name: (newData.name as string) ?? "Untitled",
            brand: (newData.brand as string) ?? null,
            price: (newData.price as number) ?? null,
            condition: (newData.condition as string) ?? null,
            status: (newData.status as string) ?? null,
            image: undefined,
            ...newData,
          };

          return {
            ...old,
            data: [appended, ...old.data],
            count: (old.count ?? 0) + 1,
          };
        });
      });

      return { previous };
    },

    onError: (_err, _variables, context) => {
      // 🟢 FIX: restore previous cache safely
      context?.previous?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
      toast.error("Failed to create listing");
    },

    onSuccess: () => {
      toast.success("Created listing");
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["watch_listings"] });
    },
  });
}

export function useDeleteWatchListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteWatchListing(id),

    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: ["watch_listings"] });

      // ✅ pakai QueryFilters object, bukan array
      const previous = qc.getQueriesData<ListingsQueryResult>({
        queryKey: ["watch_listings"],
      });

      // ✅ Update cache secara aman & typed
      previous.forEach(([key]) => {
        qc.setQueryData<ListingsQueryResult>(key, (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((item) => item.id !== id),
            count: Math.max(0, (old.count ?? 0) - 1),
          };
        });
      });

      return { previous };
    },

    onError: (_e, _id, ctx) => {
      ctx?.previous?.forEach(([key, data]) =>
        qc.setQueryData(key as QueryKey, data)
      );
      toast.error("Failed to delete item");
    },

    onSuccess: () => toast.success("Deleted successfully"),

    onSettled: () => qc.invalidateQueries({ queryKey: ["watch_listings"] }),
  });
}

export function useUpdateWatchListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<WatchListing> & { imageFile?: File };
    }) => updateWatchListing(id, data),

    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ["watch_listings"] });

      const previous = qc.getQueriesData<ListingsQueryResult>({
        queryKey: ["watch_listings"],
      });

      previous.forEach(([key]) => {
        qc.setQueryData<ListingsQueryResult>(key, (old) => {
          if (!old?.data) return old;
          const newData = old.data.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...data,
                  image: data.imageFile
                    ? URL.createObjectURL(data.imageFile)
                    : item.image,
                }
              : item
          );
          return { ...old, data: newData };
        });
      });

      return { previous };
    },

    onError: (_e, _v, ctx) => {
      ctx?.previous?.forEach(([key, data]) =>
        qc.setQueryData(key as QueryKey, data)
      );
      toast.error("Failed to update item");
    },

    onSuccess: () => toast.success("Changes saved"),

    onSettled: () => qc.invalidateQueries({ queryKey: ["watch_listings"] }),
  });
}

export function useAvailableWatchListings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["available-watch-listings"],
    queryFn: getAvailableWatchListings,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  });

  return {
    listings: data ?? [],
    isLoading,
    error,
  };
}
