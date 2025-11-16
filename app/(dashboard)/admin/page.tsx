"use client";
import SalesCard from "@/app/_components/dashboard/stats/SalesCards";
import TopBrandSalesCard from "@/app/_components/dashboard/stats/TopBrandSalesCard";
import NeedActionsTable from "@/app/_components/dashboard/stats/NeedActionsTable";
import MostTrendingWatches from "@/app/_components/dashboard/stats/MostTrendingWatches";
import RevenuePerBrandChart from "@/app/_components/dashboard/stats/RevenuePerBrandChart";
import TableFilter from "@/app/_components/dashboard/UI/TableFilter";
import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import { Box, Grid, Skeleton, Stack } from "@mui/material";
import { Suspense } from "react";

export default function Page() {
  const options = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
  ];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <HeaderText
          title="Dashboard"
          description="Overview of system metrics and insights."
        />
        <Box>
          <Suspense fallback={<Skeleton variant="rectangular" />}>
            <TableFilter filterField="period" options={options} />
          </Suspense>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid size={7}>
          {
            <Suspense fallback={<Skeleton variant="rectangular" />}>
              <SalesCard />
            </Suspense>
          }
        </Grid>
        <Grid size={5}>
          <Suspense fallback={<Skeleton variant="rectangular" />}>
            <TopBrandSalesCard />
          </Suspense>
        </Grid>
        <Grid size={8}>
          <Stack spacing={2}>
            <Suspense fallback={<Skeleton variant="rectangular" />}>
              <NeedActionsTable />
            </Suspense>
            <Suspense fallback={<Skeleton variant="rectangular" />}>
              <RevenuePerBrandChart />
            </Suspense>
          </Stack>
        </Grid>
        <Grid size={4}>
          <Suspense fallback={<Skeleton variant="rectangular" />}>
            <MostTrendingWatches />
          </Suspense>
        </Grid>
      </Grid>
    </>
  );
}
