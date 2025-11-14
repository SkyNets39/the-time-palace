// src/app/_components/UI/ConfirmationModal.tsx
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  description,
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { p: 3, borderRadius: 5 } } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ px: 3, borderRadius: 5 }}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{ px: 3, borderRadius: 5 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
