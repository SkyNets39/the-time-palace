"use client";

import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signinUser } from "@/app/_services/apiAuth/client";

type LoginData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginData>();

  const [message, setMessage] = useState("");

  const onSubmit = async (data: LoginData) => {
    setMessage("");

    try {
      await signinUser(data); // 🔹 panggil dari auth.ts
      setMessage("Login successful! Redirecting...");
      reset();
      setTimeout(() => router.replace("/"), 1000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setMessage(message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Typography
        variant="h1"
        sx={{ mb: 1, fontSize: { xs: "1.8rem", md: "2.5rem" } }}
      >
        Sign In
      </Typography>

      <TextField
        label="Email"
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Must be at least 6 characters" },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={isSubmitting}
        sx={{ py: 1.4, borderRadius: 0, boxShadow: "none" }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Login"
        )}
      </Button>

      {message && (
        <Typography
          variant="body2"
          color={message.includes("success") ? "success.main" : "error.main"}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
