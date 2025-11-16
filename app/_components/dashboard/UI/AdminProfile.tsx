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
        <CircularProgress size={20} />
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
        gap: 1.2,
        px: 1.5,
        py: 1,
      }}
    >
      {/* Avatar dengan huruf pertama nama */}
      <Avatar
        sx={{
          bgcolor: "primary.main",
          width: 30, // ⬅️ tambah ini
          height: 30, // ⬅️ tambah ini
          fontSize: "0.9rem",
        }}
      >
        {data.full_name ? data.full_name.charAt(0).toUpperCase() : "A"}
      </Avatar>

      {/* Nama lengkap dan email */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ fontSize: "0.8rem" }}
        >
          {data.full_name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.75rem" }}
        >
          {data.email}
        </Typography>
      </Box>
    </Box>
  );
}
