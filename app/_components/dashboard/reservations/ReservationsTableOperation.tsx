// src/app/_components/dashboard/reservations/ReservationsTableOperation.tsx
"use client";

import TableFilter from "@/app/_components/dashboard/UI/TableFilter";
import AdminSort from "@/app/_components/dashboard/UI/AdminSort";
import { Box } from "@mui/material";

export default function ReservationsTableOperation() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TableFilter
          filterField="status"
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "canceled", label: "Canceled" },
          ]}
        />

        <AdminSort
          label="Sort by Date"
          options={[
            { value: "date-asc", label: "Date (Near → Far)" },
            { value: "date-desc", label: "Date (Far → Near)" },
          ]}
        />
      </Box>

      {/* Keep it simple: no search for now */}
      <div />
    </Box>
  );
}
