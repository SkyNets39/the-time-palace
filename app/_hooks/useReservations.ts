// src/app/_hooks/useReservations.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { ReservationDetail, ReservationRow } from "../_types";

import { PAGE_SIZE } from "../_constants/variables";
import {
  getAllReservations,
  getReservationById,
  updateReservation,
} from "../_services/apiReservations/client";

export function useReservations() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const status = searchParams.get("status"); // may be 'all' or comma separated
  const sortBy =
    (searchParams.get("sortBy") as "date-asc" | "date-desc") || undefined;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const statusFilter = status && status !== "all" ? status.split(",") : [];

  const {
    data: { data: reservations = [], count = 0 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reservations", statusFilter, sortBy, page],
    queryFn: () => getAllReservations(statusFilter, sortBy, page),
  });

  // prefetch next/previous
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["reservations", statusFilter, sortBy, page + 1],
      queryFn: () => getAllReservations(statusFilter, sortBy, page + 1),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["reservations", statusFilter, sortBy, page - 1],
      queryFn: () => getAllReservations(statusFilter, sortBy, page - 1),
    });
  }

  return {
    reservations: reservations as ReservationRow[],
    count,
    isLoading,
    error,
    page,
  };
}

export const useReservationById = (reservationId: number) => {
  return useQuery<ReservationDetail, Error>({
    queryKey: ["reservations", reservationId],
    queryFn: () => getReservationById(reservationId),
    enabled: !!reservationId,
    staleTime: 60_000,
  });
};

export const useUpdateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      cancel_reason,
    }: {
      id: number;
      status: "pending" | "confirmed" | "canceled";
      cancel_reason?: string | null;
    }) => updateReservation(id, { status, cancel_reason }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["reservations", vars.id] });
      qc.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};
