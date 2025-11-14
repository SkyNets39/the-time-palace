"use client";

import TableFilter from "@/app/_components/dashboard/UI/TableFilter";
import AdminTableOperations from "@/app/_components/dashboard/UI/AdminTableOperations";
import { useBrands } from "@/app/_hooks/useWatchListings";
import TableToggleFilter from "@/app/_components/dashboard/UI/TableToggleFilter";
import AdminSort from "@/app/_components/dashboard/UI/AdminSort";
import AdminSearchBar from "../UI/AdminSearchBar";
import { Box } from "@mui/material";

export default function ListingsTableOperation() {
  const { data: brandOptions = [], isLoading } = useBrands();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AdminTableOperations>
        <TableFilter
          filterField="status"
          options={[
            { value: "all", label: "All" },
            { value: "available", label: "Available" },
            { value: "sold", label: "Sold" },
            { value: "pending", label: "Pending" },
          ]}
        />

        <TableFilter
          filterField="condition"
          options={[
            { value: "all", label: "All" },
            { value: "like new", label: "Like New" },
            { value: "excellent", label: "Excellent" },
            { value: "good", label: "Good" },
          ]}
        />

        {isLoading ? (
          <div>Loading brands...</div>
        ) : (
          <TableToggleFilter
            filterKey="brand"
            label="Brand"
            options={brandOptions}
          />
        )}

        {/* ✅ Sort dropdown */}
        <AdminSort
          label="Sort By"
          options={[
            { value: "newest", label: "Sort By Date (Newest first)" },
            { value: "oldest", label: "Sort By Date (Oldest first)" },
            { value: "alpha-asc", label: "Sort by Name (A-Z)" },
            { value: "alpha-desc", label: "Sort By Name (Z-A)" },
            { value: "price-asc", label: "Sort By Price (Low to High)" },
            { value: "price-desc", label: "Sort By Price (High to Low)" },
          ]}
        />
      </AdminTableOperations>
      <AdminSearchBar placeholder="Search watch name..." />
    </Box>
  );
}
