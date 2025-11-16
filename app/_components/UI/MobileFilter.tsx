// src/app/_components/layout/FilterDrawer.tsx
"use client";

import { useState } from "react";
import { Box, Drawer, IconButton, Typography, Divider } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import Filter from "@/app/_components/layout/Filter";
import type { FilterOptions } from "@/app/_components/layout/Filter";

type Props = {
  options: FilterOptions;
  lockedBrand?: string;
};

export default function FilterDrawer({ options, lockedBrand }: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  return (
    <>
      {/* Filter Button */}
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          borderRadius: 1,
          px: 1.2,
          py: 0.8,
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          gap: 1,
        }}
      >
        <FilterAltIcon fontSize="small" />
        <Typography variant="body1" fontWeight={500}>
          Filter
        </Typography>
      </IconButton>

      {/* Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 280,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography fontWeight={700}>Filter</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
            <Filter options={options} lockedBrand={lockedBrand} />
          </Box>

          <Divider />
        </Box>
      </Drawer>
    </>
  );
}
