"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getTopBrandSales,
  getRevenuePerBrand,
  getTopTrendingWatches,
} from "@/app/_services/apiDashboard/client";
import {
  DashboardPeriod,
  DashboardStats,
  RevenueBrand,
  TopBrandSales,
  TrendingWatch,
} from "../_types";

export function useDashboardStats(period: DashboardPeriod) {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboardStats", period],
    queryFn: () => getDashboardStats(period),
    staleTime: 1000 * 60, // 1 minute cache
  });
}

export function useTopBrandSales(period: DashboardPeriod) {
  return useQuery<TopBrandSales[], Error>({
    queryKey: ["topBrandSales", period],
    queryFn: () => getTopBrandSales(period),
    staleTime: 1000 * 60,
  });
}

export function useRevenuePerBrand(period: DashboardPeriod) {
  return useQuery<RevenueBrand[], Error>({
    queryKey: ["revenuePerBrand", period],
    queryFn: () => getRevenuePerBrand(period),
    staleTime: 1000 * 60, // 1 minute cache
  });
}

export function useTopTrendingWatches(period: DashboardPeriod) {
  return useQuery<TrendingWatch[], Error>({
    queryKey: ["topTrendingWatches", period],
    queryFn: () => getTopTrendingWatches(period),
    staleTime: 1000 * 60 * 5, // cache 5 menit
  });
}
