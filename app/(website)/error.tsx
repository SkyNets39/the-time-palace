"use client";

import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Button from "../_components/UI/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography variant="h3" fontWeight={700} mb={2}>
        Something went wrong !
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {error.message}
      </Typography>
      <Button onClick={() => reset()} variant="contained" sx={{ py: 2, px: 5 }}>
        Try again
      </Button>
    </Box>
  );
}
