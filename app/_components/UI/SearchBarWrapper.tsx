// src/components/UI/SearchBarWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

const SearchBar = dynamic(() => import("./SearchBar"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: "100%",
        height: "40px",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    />
  ),
});

export default function SearchBarWrapper() {
  return <SearchBar />;
}
