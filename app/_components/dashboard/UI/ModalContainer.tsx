"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode; // custom actions area; fallback to default actions if provided
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
};

export default function ModalContainer({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: {
          sx: { p: 3, borderRadius: 5 },
        },
      }}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Box mt={1}>{children}</Box>
      </DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
}
