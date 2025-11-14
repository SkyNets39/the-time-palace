"use client";

import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import Button from "@/app/_components/UI/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { updateUserInformation } from "@/app/_services/apiAuth/client";

type PasswordFormInputs = {
  password: string;
  passwordConfirm: string;
};

type Props = {
  initialData: {
    email: string | undefined;
    full_name: string;
  };
};

export default function SecurityForm({ initialData }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<PasswordFormInputs>();

  const onSubmit = async (data: PasswordFormInputs) => {
    setMessage("");

    if (data.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (data.password !== data.passwordConfirm) {
      setMessage("Password confirmation does not match.");
      return;
    }

    setLoading(true);
    try {
      await updateUserInformation({ password: data.password });
      setMessage("Password updated successfully!");
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Security Settings
      </Typography>

      <TextField
        label="Email"
        value={initialData.email ?? ""}
        fullWidth
        disabled
      />

      <TextField
        label="New Password"
        type="password"
        {...register("password")}
        fullWidth
        helperText="Password must be at least 8 characters."
      />

      <TextField
        label="Confirm New Password"
        type="password"
        {...register("passwordConfirm")}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting || loading}
        sx={{
          py: 1.4,
          fontWeight: 500,
          alignSelf: "baseline",
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Update Password"
        )}
      </Button>

      {message && (
        <Typography
          variant="body2"
          color={
            message.toLowerCase().includes("success")
              ? "success.main"
              : "error.main"
          }
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
