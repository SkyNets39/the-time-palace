"use client";

import {
  Button,
  TextField,
  Stack,
  Box,
  Avatar,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";

import {
  BRANDS,
  CONDITIONS,
  STATUSES,
  GENDERS,
} from "@/app/_constants/variables";
import { useStoreNames } from "@/app/_hooks/useStores";
import ModalContainer from "../UI/ModalContainer";
import { formatDisplayName } from "@/app/_utils/searchUtils";

type FormData = {
  name: string;
  brand: string;
  price: number | "";
  condition: string;
  status: string;
  description?: string;
  year?: number | "";
  size?: number | "";
  store?: number | "";
  gender?: string;
  with_box?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: FormData & { imageFile?: File }) => void;
};

export default function CreateListingDialog({
  open,
  onClose,
  onCreate,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      brand: BRANDS[0] ?? "",
      price: "",
      condition: CONDITIONS[0] ?? "",
      status: STATUSES[0] ?? "",
      description: "",
      year: "",
      size: "",
      store: "",
      gender: GENDERS[0] ?? "",
      with_box: false,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: stores } = useStoreNames();

  useEffect(() => {
    if (!open) {
      reset();
      setFile(null);
      setPreview(null);
    }
  }, [open, reset]);

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
      title="Create New Listing"
      actions={
        <>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ px: 4, py: 1, borderRadius: 5 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit((formData) =>
              onCreate({ ...formData, imageFile: file ?? undefined })
            )}
            sx={{ px: 4, py: 1, borderRadius: 5 }}
          >
            Create
          </Button>
        </>
      }
      maxWidth="md"
    >
      <Box sx={{ px: 1 }}>
        <Grid container spacing={3}>
          {/* Left column */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Basic Information
              </Typography>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField label="Name" fullWidth size="small" {...field} />
                )}
              />

              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Brand"
                    fullWidth
                    size="small"
                    {...field}
                  >
                    {BRANDS.map((b) => (
                      <MenuItem key={b} value={b}>
                        {formatDisplayName(b)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    size="small"
                    {...field}
                  />
                )}
              />

              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Condition"
                    fullWidth
                    size="small"
                    {...field}
                  >
                    {CONDITIONS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Status"
                    fullWidth
                    size="small"
                    {...field}
                  >
                    {STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {formatDisplayName(s)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>
          </Grid>

          {/* Right column */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Additional Details
              </Typography>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    {...field}
                  />
                )}
              />

              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Year"
                    type="number"
                    fullWidth
                    size="small"
                    {...field}
                  />
                )}
              />

              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Size (mm)"
                    type="number"
                    fullWidth
                    size="small"
                    {...field}
                  />
                )}
              />

              <Controller
                name="store"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Store"
                    fullWidth
                    size="small"
                    {...field}
                  >
                    {(stores ?? []).map((s) => (
                      <MenuItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Gender"
                        fullWidth
                        size="small"
                        {...field}
                      >
                        {GENDERS.map((g) => (
                          <MenuItem key={g} value={g}>
                            {formatDisplayName(g)}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="with_box"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox checked={Boolean(field.value)} {...field} />
                        }
                        label="With box"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box
                display="flex"
                alignItems="center"
                gap={3}
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                <Button
                  variant="contained"
                  component="label"
                  size="medium"
                  sx={{
                    py: 1.2,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFile}
                  />
                </Button>

                {preview && (
                  <Avatar
                    variant="rounded"
                    src={preview}
                    sx={{ width: 72, height: 72 }}
                  />
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ModalContainer>
  );
}
