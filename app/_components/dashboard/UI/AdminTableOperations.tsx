"use client";

import { Box } from "@mui/material";

type AdminTableOperationsProps = {
  children: React.ReactNode;
};

export default function AdminTableOperations({
  children,
}: AdminTableOperationsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1,
        mb: 3,
      }}
    >
      {children}
    </Box>
  );
}
