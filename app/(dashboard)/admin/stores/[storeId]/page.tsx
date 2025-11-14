"use client";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Divider,
  MenuItem,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";
import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import ConfirmationModal from "@/app/_components/dashboard/UI/ConfirmationModal";
import { useStoreById, useUpdateStore } from "@/app/_hooks/useStores";
import StoreWatchListingsTable from "@/app/_components/dashboard/stores/StoresWatchListingsTable";
import { Store } from "@/app/_types";

export default function Page() {
  const params = useParams();
  const storeId = Number(params.storeId);
  const { data: store, isLoading } = useStoreById(storeId);
  const updateMut = useUpdateStore();

  const [form, setForm] = useState<Partial<Store>>({});
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading || !store) return null;

  const handleChange = <K extends keyof Store>(field: K, value: Store[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    updateMut.mutate({ id: storeId, updates: form });
    setConfirmOpen(false);
    setEditMode(false);
  };

  return (
    <Box p={3}>
      <HeaderText
        title={`Store ID: ${store.id}`}
        description="Manage store details and related listings"
      />

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" mb={2}>
          Store Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <TextField
            label="ID"
            value={store.id}
            disabled
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Name"
            value={form?.name ?? store.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            disabled={!editMode}
          />
          <TextField
            label="Address"
            value={form?.address ?? store.address}
            onChange={(e) => handleChange("address", e.target.value)}
            fullWidth
            disabled={!editMode}
          />
          <TextField
            label="Open Days"
            select
            value={form?.open_days ?? store.open_days}
            onChange={(e) => handleChange("open_days", e.target.value)}
            fullWidth
            disabled={!editMode}
          >
            {[
              "Everyday",
              "Monday - Friday",
              "Monday - Sunday",
              "Monday - Thursday",
              "Monday, Wednesday, Friday",
            ].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Open Hours"
            value={form?.open_hours ?? store.open_hours}
            onChange={(e) => handleChange("open_hours", e.target.value)}
            fullWidth
            disabled={!editMode}
          />
          <TextField
            label="Phone"
            value={form?.phone ?? store.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            fullWidth
            disabled={!editMode}
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
          <Button
            variant="outlined"
            onClick={() => setEditMode((prev) => !prev)}
            disabled={editMode}
          >
            Edit
          </Button>
          {editMode && (
            <Button
              variant="contained"
              onClick={() => setConfirmOpen(true)}
              color="primary"
            >
              Save Changes
            </Button>
          )}
        </Box>
      </Paper>

      <Typography variant="h6" mb={2}>
        Current Store&apos;s listings
      </Typography>
      <StoreWatchListingsTable storeId={storeId} />

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Update"
        description={`Are you sure you want to update store "${store.name}"?`}
        confirmLabel="Save"
        cancelLabel="Cancel"
      />
    </Box>
  );
}
