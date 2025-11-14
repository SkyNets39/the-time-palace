"use client";

import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  Radio,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SortOption = {
  value: string; // e.g. "price-desc"
  label: string; // e.g. "Price (High to Low)"
};

type AdminSortProps = {
  sortKey?: string;
  label?: string;
  options: SortOption[];
};

/**
 * ✅ Simplified AdminSort — same behavior as SortBy reference
 * Hanya update query param sortBy.
 */
export default function AdminSort({
  sortKey = "sortBy",
  label = "Sort",
  options,
}: AdminSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentSort = searchParams.get(sortKey) || "";

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(sortKey, value);
    router.replace(`${pathname}?${params.toString()}`);
    setAnchorEl(null);
  }

  const activeLabel =
    options.find((opt) => opt.value === currentSort)?.label || label;

  const isActive = Boolean(currentSort);

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <Button
        variant={isActive ? "contained" : "outlined"}
        color="primary"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          px: 4,
          py: 1.3,
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 6,
          color: isActive ? "white" : "inherit",
          "&:hover": { color: "white", backgroundColor: "primary.dark" },
        }}
      >
        {activeLabel}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { borderRadius: 4, mt: 1, minWidth: 220 },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            dense
            divider
          >
            <Radio checked={currentSort === opt.value} />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
