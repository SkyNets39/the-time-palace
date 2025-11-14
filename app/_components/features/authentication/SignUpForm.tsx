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
import { signupUser } from "@/app/_services/apiAuth/client";

type SignupData = {
  full_name: string;
  phone: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupData>();

  const [message, setMessage] = useState("");

  const onSubmit = async (data: SignupData) => {
    setMessage("");

    try {
      await signupUser({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        phone: data.phone, // disesuaikan dengan parameter di auth.ts
      });

      setMessage("Signup successful! Please check your email.");
      reset();
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
        sx={{ mb: 1, fontSize: { xs: "1.8rem", md: "2rem" } }}
      >
        Create Account
      </Typography>

      <TextField
        label="Full Name"
        {...register("full_name", {
          required: "Full name is required",
          minLength: { value: 3, message: "Must be at least 3 characters" },
        })}
        error={!!errors.full_name}
        helperText={errors.full_name?.message}
      />

      <TextField
        label="Phone Number"
        {...register("phone", {
          required: "Phone number is required",
          pattern: {
            value: /^[0-9]{10,15}$/,
            message: "Invalid phone number",
          },
        })}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />

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
        sx={{ py: 1.4, borderRadius: 0 }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Sign Up"
        )}
      </Button>

      {message && (
        <Typography
          variant="body2"
          color={message.includes("successful") ? "success.main" : "error.main"}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
