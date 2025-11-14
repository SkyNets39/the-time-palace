// app/_components/dashboard/AdminLoginForm.tsx
"use client";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useAdminLogin } from "@/app/_hooks/useAuth"; // ✅ Pakai useAdminLogin

export default function AdminLoginForm() {
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();

  const { login, isPending } = useAdminLogin(); // ✅ destructure sesuai pattern baru

  const onSubmit = handleSubmit((data) => {
    login(data); // ✅ langsung panggil login()
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Admin Login
      </Typography>

      <TextField
        {...register("email")}
        label="Email"
        type="email"
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      <TextField
        {...register("password")}
        label="Password"
        type="password"
        fullWidth
        required
        sx={{ mb: 3 }}
      />

      <Button type="submit" variant="contained" fullWidth disabled={isPending}>
        {isPending ? <CircularProgress size={24} /> : "Login"}
      </Button>
    </Box>
  );
}
