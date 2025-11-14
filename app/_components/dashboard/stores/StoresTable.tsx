"use client";
import { Box, Typography } from "@mui/material";
// ❌ Hapus useRouter - tidak perlu lagi
// import { useRouter } from "next/navigation";
import AdminTable from "@/app/_components/dashboard/UI/AdminTable";
import AdminPagination from "@/app/_components/dashboard/UI/AdminPagination";
import { useStores } from "@/app/_hooks/useStores";
import ActionMenu from "@/app/_components/dashboard/UI/ActionMenu";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

type StoreRow = {
  id: number;
  name: string;
  address: string;
  open_days: string;
  open_hours: string;
  phone: string | null;
};

export default function StoresTable() {
  const { stores, count, isLoading } = useStores();

  const columns = [
    { key: "id", label: "ID", width: 80 },
    {
      key: "name",
      label: "Store Name",
      render: (row: StoreRow) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (row: StoreRow) => (
        <Typography variant="body2" color="text.secondary">
          {row.address}
        </Typography>
      ),
    },
    {
      key: "open_days",
      label: "Open Days",
      render: (row: StoreRow) => (
        <Typography variant="body2">{row.open_days}</Typography>
      ),
    },
    {
      key: "open_hours",
      label: "Open Hours",
      render: (row: StoreRow) => (
        <Typography variant="body2">{row.open_hours}</Typography>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: StoreRow) => (
        <Typography variant="body2">{row.phone ?? "-"}</Typography>
      ),
    },
    {
      key: "actions",
      label: "",
      align: "right" as const,
      render: (row: StoreRow) => (
        <ActionMenu
          actions={[
            {
              icon: <VisibilityOutlinedIcon fontSize="small" />,
              label: "See Details",
              href: `/admin/stores/${row.id}`, // ✅ Gunakan href
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Box mt={2}>
        <AdminTable<StoreRow>
          columns={columns}
          rows={stores || []}
          isLoading={isLoading}
          emptyMessage="No stores found."
        />
      </Box>
      <Box mt={2}>
        <AdminPagination count={count} />
      </Box>
    </>
  );
}
