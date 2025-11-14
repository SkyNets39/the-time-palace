"use client";

import { formatDisplayName } from "@/app/_utils/searchUtils";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback } from "react";

type TableToggleFilterProps = {
  /** Nama query param — e.g. "brand" */
  filterKey: string;
  /** Label di atas tombol */
  label: string;
  /** Semua opsi toggle yg dikirim dari parent */
  options: string[];
};

/**
 * 🔹 Dropdown toggle filter component
 * Klik button → keluar menu berisi checkbox toggle.
 * Tidak fetch data — hanya sinkronisasi dengan query params.
 */
export default function TableToggleFilter({
  filterKey,
  label,
  options,
}: TableToggleFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // ✅ Ambil selected value dari URL
  const selected = useMemo(() => {
    const value = searchParams.get(filterKey);
    return value ? value.split(",") : [];
  }, [searchParams, filterKey]);

  // ✅ Update query params (dengan reset page)
  const updateQueryParams = useCallback(
    (newValues: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      // 🔹 Update filter key
      if (newValues.length > 0) params.set(filterKey, newValues.join(","));
      else params.delete(filterKey);

      // 🔹 Reset pagination kalau ada page di query
      if (params.get("page")) params.set("page", "1");

      // 🔹 Apply ke URL
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, filterKey]
  );

  // ✅ Toggle handler
  const handleOptionClick = (option: string) => {
    const newValues = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    updateQueryParams(newValues);
  };

  const handleToggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const isActive = selected.length > 0;

  if (!options || options.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        No options available.
      </Typography>
    );

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      {/* 🔹 Main Filter Button */}
      <Button
        variant={isActive ? "contained" : "outlined"}
        color="primary"
        onClick={handleToggleMenu}
        sx={{
          px: 4,
          py: 1.3,
          fontWeight: 500,
          borderRadius: 6,
          color: isActive ? "white" : "inherit",
          "&:hover": {
            color: "white",
            backgroundColor: "primary.dark",
          },
        }}
      >
        {label}
      </Button>

      {/* 🔹 Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            mt: 1,
            minWidth: 200,
            maxHeight: 350,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleOptionClick(option)}
            dense
            divider
          >
            <Checkbox checked={selected.includes(option)} />
            <ListItemText
              slotProps={{
                primary: {
                  sx: { fontSize: "1rem" },
                },
              }}
              primary={formatDisplayName(option)}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
