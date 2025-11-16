"use client";

import { Box, Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterOption = {
  value: string;
  label: string;
};

type AdminFilterProps = {
  /** e.g. "status", "brand" */
  filterField: string;
  options: FilterOption[];
};

export default function TableFilter({
  filterField,
  options,
}: AdminFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = searchParams.get(filterField) || options[0]?.value;

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filterField, value);
    if (params.get("page")) params.set("page", "1"); // Reset pagination if exists
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.35,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 0.3,
      }}
    >
      {options.map((option) => {
        const isActive = option.value === currentFilter;
        return (
          <Button
            key={option.value}
            onClick={() => handleClick(option.value)}
            variant={isActive ? "contained" : "text"}
            color={isActive ? "primary" : "inherit"}
            sx={{
              px: 1.3,
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 2.5,
              minHeight: 32,
              color: isActive ? "white" : "text.primary",
              "&:hover": {
                bgcolor: isActive ? "primary.dark" : "action.hover",
                color: isActive ? "white" : "text.primary",
              },
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </Box>
  );
}
