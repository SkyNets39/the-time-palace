"use client";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import ShoppingBagTwoToneIcon from "@mui/icons-material/ShoppingBagTwoTone";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import { useSearchParams } from "next/navigation";
import { useDashboardStats } from "@/app/_hooks/useDashboard";
import { blue, green, purple } from "@mui/material/colors";

export default function SalesCard() {
  const params = useSearchParams();
  const period = (params.get("period") as "7d" | "30d" | "90d") || "7d";
  const { data, isLoading } = useDashboardStats(period);

  const periodLabel =
    period === "7d"
      ? "Last 7 days"
      : period === "30d"
      ? "Last 30 days"
      : "Last 90 days";

  const items = [
    {
      label: "Total Sales",
      value: data ? `$${data.totalSales.toLocaleString()}` : "-",
      icon: (
        <MonetizationOnTwoToneIcon
          sx={{ fontSize: "3rem", color: green[400] }}
        />
      ),
    },
    {
      label: "Total Orders",
      value: data ? data.totalOrders.toString() : "-",
      icon: (
        <ShoppingBagTwoToneIcon sx={{ fontSize: "3rem", color: purple[400] }} />
      ),
    },
    {
      label: "New Users",
      value: data ? data.newUsers.toString() : "-",
      icon: (
        <PersonAddTwoToneIcon sx={{ fontSize: "3rem", color: blue[400] }} />
      ),
    },
  ];

  if (isLoading)
    return (
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          height: "100%",
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
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        {`${periodLabel} sales`}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Sales Summary
      </Typography>

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
            <Card
              variant="outlined"
              sx={{ borderRadius: 2, py: 1, height: "100%" }}
            >
              <CardContent>
                {item.icon}
                <Box>
                  <Typography fontWeight={700} fontSize={"1.55rem"}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
