"use client";

import { useTopTrendingWatches } from "@/app/_hooks/useDashboard";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function MostTrendingWatches() {
  const params = useSearchParams();
  const period = (params.get("period") as "7d" | "30d" | "90d") || "7d";
  const { data, isLoading } = useTopTrendingWatches(period);

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
      <Typography variant="h6" fontWeight={700} textAlign={"center"} mt={1}>
        Top 10 Items with Most Reservations
      </Typography>

      <CardContent>
        {isLoading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Table size="small">
            <TableHead sx={{ bgcolor: "divider" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, textTransform: "uppercase" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textTransform: "uppercase" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textTransform: "uppercase" }}>
                  amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.totalReservations}</TableCell>
                </TableRow>
              ))}
              {data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No reservations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
