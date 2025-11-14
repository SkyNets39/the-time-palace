"use client";

import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import Button from "@/app/_components/UI/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { updateUserInformation } from "@/app/_services/apiAuth/client";

type InfoFormInputs = {
  full_name: string;
  phone: string;
  address: string;
};

type Props = {
  initialData: {
    email: string | undefined;
    full_name: string;
    phone: string;
    address: string;
  };
};

export default function EditProfileForm({ initialData }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InfoFormInputs>({
    defaultValues: {
      full_name: initialData.full_name,
      phone: initialData.phone,
      address: initialData.address,
    },
  });

  const onSubmit = async (data: InfoFormInputs) => {
    setMessage("");
    setLoading(true);

    try {
      await updateUserInformation({
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
      });
      setMessage("Profile updated successfully!");
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
        Edit Profile
      </Typography>

      <TextField
        label="Full Name"
        placeholder="Enter your full name"
        {...register("full_name", {
          required: "Full name is required",
          minLength: { value: 3, message: "At least 3 characters" },
        })}
        error={!!errors.full_name}
        helperText={errors.full_name?.message}
        fullWidth
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: "#9E9E9E",
            opacity: 1,
          },
        }}
      />

      <TextField
        label="Phone Number (include country code)"
        placeholder="+6281234567890"
        {...register("phone", {
          required: "Phone number is required",
          pattern: {
            value: /^\+?\d{12,}$/,
            message:
              "Phone number must include country code and be at least 12 digits.",
          },
        })}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: "#9E9E9E",
            opacity: 1,
          },
        }}
      />

      <TextField
        label="Address"
        placeholder="Enter your address"
        {...register("address")}
        fullWidth
        multiline
        minRows={2}
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: "#9E9E9E",
            opacity: 1,
          },
        }}
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
          "Update Information"
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
