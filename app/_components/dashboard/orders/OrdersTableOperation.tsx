"use client";

import { Box } from "@mui/material";
import AdminTableOperations from "@/app/_components/dashboard/UI/AdminTableOperations";
import TableFilter from "@/app/_components/dashboard/UI/TableFilter";
import AdminSort from "@/app/_components/dashboard/UI/AdminSort";
import AdminSearchBar from "@/app/_components/dashboard/UI/AdminSearchBar";

export default function OrdersTableOperation() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* LEFT SIDE — Filters and Sort */}
      <AdminTableOperations>
        {/* ✅ Filter by Status */}
        <TableFilter
          filterField="status"
          options={[
            { value: "all", label: "All" },
            { value: "completed", label: "Completed" },
            { value: "refunded", label: "Refunded" },
          ]}
        />

        {/* ✅ Sort dropdown */}
        <AdminSort
          label="Sort By"
          options={[
            { value: "date-desc", label: "Date (Newest first)" },
            { value: "date-asc", label: "Date (Oldest first)" },
            { value: "amount-desc", label: "Amount (High to Low)" },
            { value: "amount-asc", label: "Amount (Low to High)" },
          ]}
        />
      </AdminTableOperations>

      {/* RIGHT SIDE — Search Bar */}
      <AdminSearchBar placeholder="Search customer name..." />
    </Box>
  );
}
