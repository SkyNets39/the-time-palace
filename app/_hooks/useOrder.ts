"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order, OrderFilters, OrderSortOption } from "../_types/order";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../_services/apiOrders/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { PAGE_SIZE } from "../_constants/variables";

type CreateOrderPayload = {
  reservation_id?: number | null;
  customer_name: string;
  customer_email: string;
  phone: string;
  warranty: boolean;
  watch_ids: number[];
};

// export const useOrders = () => {
//   return useQuery<Order[], Error>({
//     queryKey: ["orders"],
//     queryFn: getOrders,
//     staleTime: 0,
//   });
// };

export function useOrders() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // ✅ Ambil query params dari URL
  const status = searchParams.get("status");
  const sortBy = (searchParams.get("sortBy") as OrderSortOption) || undefined;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const keyword = searchParams.get("q") || "";

  // ✅ Bentuk filters
  const filters: OrderFilters = {
    status: status && status !== "all" ? status.split(",") : [],
  };

  // ✅ Query utama
  const {
    data: { data: orders = [], count = 0 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", filters, sortBy, page, keyword],
    queryFn: () => getOrders(filters, sortBy, page, keyword),
  });

  // ✅ Prefetch next & previous pages
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["orders", filters, sortBy, page + 1],
      queryFn: () => getOrders(filters, sortBy, page + 1, keyword),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["orders", filters, sortBy, page - 1],
      queryFn: () => getOrders(filters, sortBy, page - 1, keyword),
    });
  }

  return { orders, count, isLoading, error, page };
}

export const useOrderById = (orderId: number) => {
  return useQuery<Order, Error>({
    queryKey: ["orders", orderId],
    queryFn: async () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      orderId: number;
      status: "completed" | "refunded";
    }) => {
      return updateOrderStatus(vars.orderId, vars.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      console.error("❌ Mutation error:", err);
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<number, Error, CreateOrderPayload>({
    mutationFn: createOrder,
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/admin/orders/${orderId}`);
    },
  });
};
