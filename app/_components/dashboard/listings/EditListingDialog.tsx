"use client";

import { Button, TextField, Stack, Box, Avatar, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { BRANDS, CONDITIONS, STATUSES } from "@/app/_constants/variables";
import ModalContainer from "../UI/ModalContainer";
import { formatDisplayName } from "@/app/_utils/searchUtils";

type FormData = {
  name: string;
  brand: string;
  price: number;
  condition: string;
  status: string;
};

type WatchListing = FormData & {
  id: number;
  image?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialData: WatchListing | null;
  onSave: (data: FormData & { imageFile?: File }) => void;
};

export default function EditListingDialog({
  open,
  onClose,
  initialData,
  onSave,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name ?? "",
        brand: initialData.brand ?? "rolex",
        price: initialData.price ?? "",
        condition: initialData.condition ?? "like new",
        status: initialData.status ?? "available",
      });
      setPreview(initialData.image ?? null);
      setFile(null);
    }
  }, [initialData, reset]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      title="Edit Listing"
      actions={
        <>
          <Button onClick={onClose} sx={{ borderRadius: 5, px: 3, py: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: 5, px: 3, py: 1 }}
            onClick={handleSubmit((formData) =>
              onSave({ ...formData, imageFile: file ?? undefined })
            )}
          >
            Save Edit
          </Button>
        </>
      }
    >
      <Stack spacing={2} mt={1}>
        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField label="Name" fullWidth {...field} />
          )}
        />

        {/* Brand */}
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <TextField select label="Brand" fullWidth {...field}>
              {BRANDS.map((b) => (
                <MenuItem key={b} value={b}>
                  {formatDisplayName(b)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Price */}
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField label="Price" type="number" fullWidth {...field} />
          )}
        />

        {/* Condition */}
        <Controller
          name="condition"
          control={control}
          render={({ field }) => (
            <TextField select label="Condition" fullWidth {...field}>
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c}>
                  {formatDisplayName(c)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField select label="Status" fullWidth {...field}>
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {formatDisplayName(s)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Upload */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="outlined" component="label" size="small">
            Upload Image
            <input hidden accept="image/*" type="file" onChange={handleFile} />
          </Button>
          {preview && (
            <Avatar
              variant="rounded"
              src={preview}
              sx={{ width: 64, height: 64 }}
            />
          )}
        </Box>
      </Stack>
    </ModalContainer>
  );
}
