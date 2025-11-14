"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSearchParams } from "next/navigation";
import { useRevenuePerBrand } from "@/app/_hooks/useDashboard";
import { formatUSD } from "@/app/_utils/currencyFormat";
import { deepPurple, teal } from "@mui/material/colors";

export default function RevenuePerBrandChart() {
  const params = useSearchParams();
  const period = (params.get("period") as "7d" | "30d" | "90d") || "7d";
  const { data, isLoading } = useRevenuePerBrand(period);

  const periodLabel =
    period === "7d"
      ? "Last 7 days"
      : period === "30d"
      ? "Last 30 days"
      : "Last 90 days";

  if (isLoading)
    return (
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          height: 320,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        bgcolor: "white",
        p: 4,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        height: 380,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={1}>
        Revenue per Brand
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {periodLabel} summary — completed vs active reservations
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data || []}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="brand" />
          <YAxis tickFormatter={(val) => formatUSD(val)} />
          <Tooltip formatter={(val) => formatUSD(val as number)} />
          <Legend />
          <Bar
            dataKey="completedRevenue"
            name="Completed Sales"
            fill={teal[400]}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="activeReservationRevenue"
            name="Active Reservations"
            fill={deepPurple[400]}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
