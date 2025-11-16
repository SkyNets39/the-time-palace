"use client";

import TableFilter from "@/app/_components/dashboard/UI/TableFilter";
import AdminTableOperations from "@/app/_components/dashboard/UI/AdminTableOperations";
import { useBrands } from "@/app/_hooks/useWatchListings";
import MultiFilter from "@/app/_components/dashboard/UI/MultiFilter";
import AdminSort from "@/app/_components/dashboard/UI/AdminSort";
import AdminSearchBar from "../UI/AdminSearchBar";
import { Box, CircularProgress } from "@mui/material";
import Loading from "../../UI/Loading";

export default function ListingsTableOperation() {
  const { data: brandOptions = [], isLoading } = useBrands();

  return (
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
        <CircularProgress size={30} />
      ) : (
        <MultiFilter filterKey="brand" label="Brand" options={brandOptions} />
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
      <Box sx={{ marginLeft: "auto" }}>
        <AdminSearchBar placeholder="Search watch name..." />
      </Box>
    </AdminTableOperations>
  );
}
