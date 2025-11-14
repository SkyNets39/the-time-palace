"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, Chip, Typography } from "@mui/material";
import AdminTable from "@/app/_components/dashboard/UI/AdminTable";
import {
  useCreateWatchListing,
  useWatchListings,
  useDeleteWatchListing,
  useUpdateWatchListing,
} from "@/app/_hooks/useWatchListings";
import { formatDisplayName } from "@/app/_utils/searchUtils";
import AdminPagination from "../UI/AdminPagination";
import ActionMenu from "@/app/_components/dashboard/UI/ActionMenu";
import ConfirmDeleteDialog from "@/app/_components/dashboard/UI/ConfirmDeleteDialog";
import EditListingDialog from "@/app/_components/dashboard/listings/EditListingDialog";
import Button from "../../UI/Button";
import CreateListingDialog from "./CreateListingDialog";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { getWatchStatusColor } from "@/app/_constants/semanticColor";

type WatchListing = {
  id: number;
  name: string;
  brand: string;
  price: number;
  condition: string;
  image: string;
  status: string;
};

export default function ListingsTable() {
  const { listings, count, isLoading } = useWatchListings();
  const deleteMut = useDeleteWatchListing();
  const updateMut = useUpdateWatchListing();
  const createMut = useCreateWatchListing();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WatchListing | null>(null);
  const [editTarget, setEditTarget] = useState<WatchListing | null>(null);

  const columns = [
    {
      key: "image",
      label: "",
      render: (row: WatchListing) => (
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
      render: (row: WatchListing) => (
        <Typography variant="body2" fontWeight={500}>
          {formatDisplayName(row.brand)}
        </Typography>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: WatchListing) => (
        <Typography variant="body2" fontWeight={600}>
          ${Number(row.price).toLocaleString()}
        </Typography>
      ),
    },
    {
      key: "condition",
      label: "Condition",
      render: (row: WatchListing) => (
        <Typography variant="body2" fontWeight={500} textTransform="capitalize">
          {row.condition}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: WatchListing) => {
        const { bg, color } = getWatchStatusColor(row.status);
        return (
          <Chip
            label={row.status}
            sx={{
              px: 1,
              textTransform: "capitalize",
              fontWeight: 600,
              bgcolor: bg,
              color,
              border: "1px solid",
            }}
          />
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (row: WatchListing) => (
        <ActionMenu
          actions={[
            {
              icon: <ModeEditOutlineOutlinedIcon fontSize="small" />,
              label: "Edit",
              onClick: () => setEditTarget(row),
            },
            {
              icon: (
                <DeleteOutlineOutlinedIcon fontSize="small" color="error" />
              ),
              label: "Delete",
              color: "error",
              onClick: () => setDeleteTarget(row),
            },
          ]}
        />
      ),
      align: "right" as const,
    },
  ];

  return (
    <>
      <Box display="flex" mb={2}>
        <Button
          variant="contained"
          onClick={() => setCreateOpen(true)}
          sx={{ px: 4, py: 2, borderRadius: 10 }}
        >
          + Create New Listing
        </Button>
      </Box>

      <AdminTable<WatchListing>
        columns={columns}
        rows={listings || []}
        isLoading={isLoading}
        emptyMessage="No watch listings found."
      />

      <AdminPagination count={count} />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.name}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMut.mutate(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />

      {/* Edit Dialog */}
      <EditListingDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        initialData={editTarget}
        onSave={(data) => {
          if (!editTarget) return;
          updateMut.mutate({ id: editTarget.id, data });
          setEditTarget(null);
        }}
      />

      {/* Create Dialog */}
      <CreateListingDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(formData) => {
          const payload: Record<string, unknown> = {
            ...formData,
            price:
              formData.price === "" || formData.price === null
                ? undefined
                : Number(formData.price),
            year:
              formData.year === "" || formData.year === null
                ? undefined
                : Number(formData.year),
            size:
              formData.size === "" || formData.size === null
                ? undefined
                : Number(formData.size),
            store: formData.store ? Number(formData.store) : undefined,
            with_box: Boolean(formData.with_box),
          };

          createMut.mutate(payload);
          setCreateOpen(false);
        }}
      />
    </>
  );
}
