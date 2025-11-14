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
  itemName?: string;
};

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  itemName,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { p: 3, borderRadius: 5 },
        },
      }}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete <b>{itemName}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ px: 3, borderRadius: 5 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{ px: 3, borderRadius: 5 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
