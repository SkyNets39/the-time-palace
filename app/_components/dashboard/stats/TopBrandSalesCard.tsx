"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useSearchParams } from "next/navigation";
import { useTopBrandSales } from "@/app/_hooks/useDashboard";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#F06292",
  "#4DB6AC",
  "#FFD54F",
];

export default function TopBrandSalesCard() {
  const params = useSearchParams();
  const period = (params.get("period") as "7d" | "30d" | "90d") || "7d";
  const { data, isLoading } = useTopBrandSales(period);

  const periodLabel =
    period === "7d"
      ? "Last 7 days"
      : period === "30d"
      ? "Last 30 days"
      : "Last 90 days";

  return (
    <Card
      sx={{
        borderRadius: 2,
        p: 2,
        height: "100%",
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Item Sold by Brand ({periodLabel})
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="totalSold"
                nameKey="brand"
                cx="50%"
                cy="50%"
                innerRadius={"60%"}
                outerRadius={"80%"}
                label
              >
                {data?.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} sold`, "Total"]}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#ddd",
                  backgroundColor: "#fff",
                }}
              />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
