// app/_components/dashboard/UI/ActionMenu.tsx
"use client";
import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";

export type ActionItem = {
  label: string;
  icon?: React.ReactNode;
  color?: "default" | "error" | "primary";
  onClick?: () => void; // ✅ Optional sekarang
  href?: string; // ✅ Tambah href untuk Link
};

type Props = {
  actions: ActionItem[];
  size?: "small" | "medium";
};

export default function ActionMenu({ actions, size = "small" }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size={size} onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon sx={{ fontSize: "1.1rem" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: { sx: { border: "1px solid", boxShadow: "none" } },
        }}
      >
        {actions.map((a, i) => {
          // ✅ Jika ada href, gunakan Link component
          if (a.href) {
            return (
              <MenuItem
                key={i}
                component={Link}
                href={a.href}
                onClick={() => setAnchorEl(null)}
                sx={{
                  fontSize: "0.85rem",
                  color:
                    a.color === "error"
                      ? "error.main"
                      : a.color === "primary"
                      ? "primary.main"
                      : "text.primary",
                }}
              >
                {a.icon && (
                  <ListItemIcon sx={{ minWidth: 26 }}>{a.icon}</ListItemIcon>
                )}
                <ListItemText
                  slotProps={{
                    primary: {
                      sx: { fontSize: "0.85rem" },
                    },
                  }}
                >
                  {a.label}
                </ListItemText>
              </MenuItem>
            );
          }

          // ✅ Jika ada onClick, gunakan onClick biasa
          return (
            <MenuItem
              key={i}
              onClick={() => {
                setAnchorEl(null);
                a.onClick?.();
              }}
              sx={{
                fontSize: "1rem",
                color:
                  a.color === "error"
                    ? "error.main"
                    : a.color === "primary"
                    ? "primary.main"
                    : "text.primary",
              }}
            >
              {a.icon && (
                <ListItemIcon sx={{ minWidth: 36 }}>{a.icon}</ListItemIcon>
              )}
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { fontSize: "0.8rem" },
                  },
                }}
              >
                {a.label}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
