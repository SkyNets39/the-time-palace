"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStoreById,
  getStoreNames,
  getStores,
  updateStore,
} from "../_services/apiStores/client";
import { PAGE_SIZE } from "../_constants/variables";
import { useSearchParams } from "next/navigation";
import { Store } from "../_types";

export function useStores() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const {
    data: { data: stores = [], count = 0 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stores", page],
    queryFn: () => getStores(page),
  });

  // Prefetch next & previous pages
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["stores", page + 1],
      queryFn: () => getStores(page + 1),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["stores", page - 1],
      queryFn: () => getStores(page - 1),
    });
  }

  return { stores, count, isLoading, error, page };
}

export function useStoreNames() {
  return useQuery({
    queryKey: ["stores", "names"],
    queryFn: getStoreNames,
    staleTime: 1000 * 60 * 10,
  });
}

export function useStoreById(storeId: number) {
  return useQuery<Store, Error>({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
    enabled: !!storeId,
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Store> }) =>
      updateStore(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["store", id] });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
