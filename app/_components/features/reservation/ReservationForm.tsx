"use client";

import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import Button from "../../UI/Button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { createClient } from "@/app/_services/supabase/client";
import { useRouter } from "next/navigation";
import {
  getClientInfoClient,
  getProfileNameClient,
} from "@/app/_services/apiProfileClient/client";
import { createReservation } from "@/app/_services/apiReservations/client";

type ReservationInputs = {
  full_name: string;
  phone: string;
  reservation_date: string;
};

export default function ReservationForm({ watchId }: { watchId: number }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,

    setValue,
    formState: { errors },
  } = useForm<ReservationInputs>({
    defaultValues: {
      full_name: "",
      phone: "",
      reservation_date: "",
    },
  });

  // 🔹 Fetch default user data (name & phone)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const [profile, client] = await Promise.all([
            getProfileNameClient(user.id),
            getClientInfoClient(user.id),
          ]);

          if (profile) setValue("full_name", profile);
          if (client?.phone) setValue("phone", client.phone);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [setValue]);

  // 🔹 Submit form
  const onSubmit = async (data: ReservationInputs) => {
    setMessage("");
    setLoading(true);

    try {
      await createReservation({
        watch_id: watchId,
        full_name: data.full_name,
        phone: data.phone,
        reservation_date: data.reservation_date,
        status: "pending",
      });

      // ✅ Redirect ke thank you page & replace router
      router.replace(`/collections/${watchId}/reservation/thankyou`);
    } catch (error) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "20vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Reserve This Watch
      </Typography>

      <TextField
        label="Full Name"
        {...register("full_name", {
          required: "Full name is required",
          minLength: { value: 3, message: "At least 3 characters" },
        })}
        error={!!errors.full_name}
        helperText={errors.full_name?.message}
        fullWidth
      />

      <TextField
        label="Phone Number"
        {...register("phone", {
          required: "Phone number is required",
          pattern: {
            value: /^\+?\d{10,}$/,
            message: "Phone number must include country code and be valid",
          },
        })}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
      />

      <TextField
        label="Reservation Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register("reservation_date", {
          required: "Please select a reservation date",
        })}
        error={!!errors.reservation_date}
        helperText={errors.reservation_date?.message}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          p: 2,
          mt: 1,
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Submit Reservation"
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
