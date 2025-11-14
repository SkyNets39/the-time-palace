// src/app/_components/dashboard/reservations/CancelReservationDialog.tsx
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

type FormValues = {
  reason: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  itemName?: string;
};

export default function CancelReservationDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { reason: "" },
  });

  // reset when closed
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { p: 3, borderRadius: 5 } } }}
    >
      <DialogTitle>Cancel Reservation</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <Controller
            name="reason"
            control={control}
            rules={{ required: "Cancellation reason is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Cancellation reason"
                fullWidth
                multiline
                minRows={3}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ px: 3, borderRadius: 5 }}>
          Back
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit((vals) => onConfirm(vals.reason))}
          sx={{ px: 3, borderRadius: 5 }}
        >
          Confirm Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
