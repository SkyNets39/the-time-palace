"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";
import AdminTable from "@/app/_components/dashboard/UI/AdminTable";
import AdminPagination from "@/app/_components/dashboard/UI/AdminPagination";
import { useWatchListings } from "@/app/_hooks/useWatchListings";
import { formatDisplayName } from "@/app/_utils/searchUtils";

type WatchRow = {
  id: number;
  name: string;
  brand?: string | null;
  price?: number | null;
  condition?: string | null;
  image?: string | null;
  status?: string | null;
  store?: number | null;
};

export default function StoresWatchListingsTable({
  storeId,
}: {
  storeId: number;
}) {
  const { listings = [], count, isLoading } = useWatchListings(storeId);

  const columns = [
    {
      key: "image",
      label: "",
      render: (row: WatchRow) => (
        <Image
          unoptimized
          src={row.image || "/placeholder.png"}
          alt={row.name}
          width={48}
          height={48}
        />
      ),
      width: 60,
    },
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "brand",
      label: "Brand",
      render: (row: WatchRow) => (
        <Typography variant="body2" fontWeight={500}>
          {formatDisplayName(row.brand ?? "")}
        </Typography>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: WatchRow) => (
        <Typography variant="body2" fontWeight={600}>
          {row.price != null ? `$${Number(row.price).toLocaleString()}` : "-"}
        </Typography>
      ),
    },
    {
      key: "condition",
      label: "Condition",
      render: (row: WatchRow) => (
        <Typography variant="body2">{row.condition ?? "-"}</Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: WatchRow) => (
        <Typography
          variant="body2"
          fontWeight={600}
          textTransform="capitalize"
          sx={{
            color:
              (row.status ?? "").toLowerCase() === "available"
                ? "success.main"
                : (row.status ?? "").toLowerCase() === "sold"
                ? "error.main"
                : "text.secondary",
          }}
        >
          {row.status ?? "-"}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Box mt={2}>
        <AdminTable<WatchRow>
          columns={columns}
          rows={listings || []}
          isLoading={isLoading}
          emptyMessage="No watch listings for this store."
        />
      </Box>

      <Box mt={2}>
        <AdminPagination count={count} />
      </Box>
    </>
  );
}
