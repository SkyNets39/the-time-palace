"use client";

import {
  Box,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Button from "../../UI/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { updateUserInformation } from "@/app/_services/apiAuth/client";

type SettingsFormProps = {
  initialData: {
    email: string | undefined | null;
    full_name: string;
    phone: string;
    address: string;
  };
};

type InfoFormInputs = {
  full_name: string;
  phone: string;
  address: string;
};

type PasswordFormInputs = {
  password: string;
  passwordConfirm: string;
};

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [message, setMessage] = useState("");
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  // 🧾 USER INFO FORM
  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors, isSubmitting: infoSubmitting },
  } = useForm<InfoFormInputs>({
    defaultValues: {
      full_name: initialData.full_name,
      phone: initialData.phone,
      address: initialData.address,
    },
  });

  // 🔒 PASSWORD FORM
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
    reset: resetPasswordForm,
  } = useForm<PasswordFormInputs>();

  /**
   * Handle Update Info
   */
  const onSubmitInfo = async (data: InfoFormInputs) => {
    setMessage("");
    setLoadingSection("info");

    try {
      await updateUserInformation({
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
      });
      setMessage("User information updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("An unexpected error occurred");
    } finally {
      setLoadingSection(null);
    }
  };

  /**
   * Handle Update Password
   */
  const onSubmitPassword = async (data: PasswordFormInputs) => {
    setMessage("");

    if (data.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (data.password !== data.passwordConfirm) {
      setMessage("Password confirmation does not match.");
      return;
    }

    setLoadingSection("password");

    try {
      await updateUserInformation({ password: data.password });
      setMessage("Password updated successfully!");
      resetPasswordForm();
    } catch (error: unknown) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("An unexpected error occurred");
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        width: "100%",
        borderRadius: 4,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        backgroundColor: "background.paper",
      }}
    >
      <CardContent sx={{ p: { xs: 4, md: 6 } }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Account Settings
        </Typography>

        {/* 🔒 USER AUTHENTICATION SECTION */}
        <Box
          component="form"
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
          sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 5 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            User Authentication
          </Typography>

          <TextField
            label="Email"
            value={initialData.email ?? ""}
            fullWidth
            disabled
            sx={{ mb: 1 }}
          />

          <TextField
            label="New Password"
            type="password"
            {...registerPassword("password")}
            fullWidth
            helperText="Password must be at least 8 characters."
            sx={{ mb: 1 }}
            error={!!pwErrors.password}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            {...registerPassword("passwordConfirm")}
            fullWidth
            error={!!pwErrors.passwordConfirm}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={pwSubmitting || loadingSection === "password"}
            sx={{
              py: 1.4,
              fontWeight: 500,
              mt: 1,
              alignSelf: "baseline",
            }}
          >
            {loadingSection === "password" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 🧾 USER INFORMATION SECTION */}
        <Box
          component="form"
          onSubmit={handleInfoSubmit(onSubmitInfo)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            User Information
          </Typography>

          <TextField
            label="Full Name"
            {...registerInfo("full_name", {
              required: "Full name is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            error={!!infoErrors.full_name}
            helperText={infoErrors.full_name?.message}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Phone Number (include country code, e.g. +6281234567890)"
            {...registerInfo("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\+?\d{12,}$/,
                message:
                  "Phone number must include country code and be at least 12 digits.",
              },
            })}
            error={!!infoErrors.phone}
            helperText={infoErrors.phone?.message}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Address"
            {...registerInfo("address")}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={infoSubmitting || loadingSection === "info"}
            sx={{
              py: 1.4,
              fontWeight: 500,
              mt: 1,
              alignSelf: "baseline",
            }}
          >
            {loadingSection === "info" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Information"
            )}
          </Button>
        </Box>

        {/* FEEDBACK MESSAGE */}
        {message && (
          <Typography
            variant="body2"
            color={
              message.toLowerCase().includes("success")
                ? "success.main"
                : "error.main"
            }
            sx={{ mt: 3 }}
          >
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
