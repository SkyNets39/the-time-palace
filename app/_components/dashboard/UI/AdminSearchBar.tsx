// src/app/_components/UI/AdminSearchBar.tsx
"use client";

import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type SearchBarProps = {
  placeholder?: string;
  paramKey?: string; // default "q"
  debounceMs?: number; // default 500
};

export default function AdminSearchBar({
  placeholder = "Search...",
  paramKey = "q",
  debounceMs = 500,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramKey) || "");

  // Debounce URL update
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) params.set(paramKey, value.trim());
      else params.delete(paramKey);
      router.replace(`${pathname}?${params.toString()}`);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, debounceMs, paramKey, pathname, router, searchParams]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid",
        borderColor: "black",
        bgcolor: "background.paper",
        borderRadius: 5,
        px: 1,
        height: 34,
        width: "220px",
      }}
    >
      <SearchIcon sx={{ fontSize: 20, color: "text.secondary", mr: 0.5 }} />
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          flex: 1,
          fontSize: "0.75rem",
          color: "text.primary",
          py: 0.2,
        }}
        inputProps={{ "aria-label": "search" }}
      />
      {value && (
        <IconButton
          onClick={() => setValue("")}
          size="small"
          sx={{
            color: "text.secondary",
            p: 0.2,
            fontSize: "0.75rem",
          }}
        >
          ✕
        </IconButton>
      )}
    </Box>
  );
}
