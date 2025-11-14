"use client";

import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import { useAdmin } from "@/app/_hooks/useAuth";

export default function AdminProfile() {
  const { data, isLoading, isError, error } = useAdmin();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 1,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2">Loading profile...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ px: 2 }}>
        {(error as Error).message || "Failed to load admin profile"}
      </Typography>
    );
  }

  if (!data) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1.5,
      }}
    >
      {/* Avatar dengan huruf pertama nama */}
      <Avatar sx={{ bgcolor: "primary.main" }}>
        {data.full_name ? data.full_name.charAt(0).toUpperCase() : "A"}
      </Avatar>

      {/* Nama lengkap dan email */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {data.full_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.email}
        </Typography>
      </Box>
    </Box>
  );
}
