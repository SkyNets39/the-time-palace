"use client";

import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Avatar,
  Button,
  Chip,
  Skeleton,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import ConfirmationModal from "@/app/_components/dashboard/UI/ConfirmationModal";
import CancelReservationDialog from "@/app/_components/dashboard/reservations/CancelReservationDialog";

import { formatUSD } from "@/app/_utils/currencyFormat";
import {
  useReservationById,
  useUpdateReservation,
} from "@/app/_hooks/useReservations";
import { getReservationStatusColor } from "@/app/_constants/semanticColor";
import { formatDisplayName } from "@/app/_utils/searchUtils";

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = Number(params.reservationId);

  const { data: reservation, isLoading } = useReservationById(reservationId);
  const updateMut = useUpdateReservation();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading || !reservation) return null;

  const { watch } = reservation;
  const status = reservation.status;
  const { bg, color } = getReservationStatusColor(status);

  return (
    <>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <HeaderText
          title={`Reservation ID: ${reservation.id}`}
          description={`${new Date(
            reservation.reservation_date || reservation.created_at || ""
          ).toLocaleDateString("id-ID")}`}
        />

        <Chip
          label={status.toUpperCase()}
          sx={{
            px: 2,
            fontSize: "0.6rem",
            fontWeight: 700,
            bgcolor: bg,
            color: color,
            border: "1px solid",
          }}
        />
      </Box>

      {/* WATCH INFO */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Typography variant="h6" mb={2} fontFamily={"montserrat"}>
          Reserved Watch
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <Avatar
              src={watch?.image || "/placeholder.png"}
              alt={watch?.name}
              variant="rounded"
              sx={{ width: 160, height: 160, borderRadius: 2 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 10 }}>
            <Box display="grid" gridTemplateColumns="160px 1fr" rowGap={1.5}>
              <Typography color="text.secondary">Watch ID</Typography>
              <Typography>{watch?.id ?? "-"}</Typography>

              <Typography color="text.secondary">Name</Typography>
              <Typography>{watch?.name ?? "-"}</Typography>

              <Typography color="text.secondary">Brand</Typography>
              <Typography>
                {formatDisplayName(watch?.brand ?? "") || "-"}
              </Typography>

              <Typography color="text.secondary">Condition</Typography>
              <Typography>{watch?.condition ?? "-"}</Typography>

              <Typography color="text.secondary">Price</Typography>
              <Typography>{formatUSD(watch?.price ?? 0)}</Typography>

              <Typography color="text.secondary">Status</Typography>
              <Typography>{watch?.status ?? "-"}</Typography>

              <Typography color="text.secondary">
                Active Reservations
              </Typography>
              <Typography>
                {reservation.active_reservations_count ?? 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* RESERVATION DETAIL */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" mb={2} fontFamily={"montserrat"}>
          Reservation Detail
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="grid" gridTemplateColumns="160px 1fr" rowGap={1.5}>
          <Typography color="text.secondary">Full name</Typography>
          <Typography>{reservation.full_name ?? "-"}</Typography>

          <Typography color="text.secondary">Phone</Typography>
          <Typography>{reservation.phone ?? "-"}</Typography>

          <Typography color="text.secondary">Status</Typography>
          <Typography textTransform="capitalize">{status}</Typography>

          <Typography color="text.secondary">Cancellation reason</Typography>
          <Typography>{reservation.cancel_reason ?? "-"}</Typography>
        </Box>
      </Paper>

      {/* ACTION BUTTONS */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        {/* Always show Back */}
        <Button
          variant="outlined"
          onClick={() => router.back()}
          sx={{ borderRadius: 5, px: 3 }}
        >
          Back
        </Button>

        {/* Show Cancel button if pending or confirmed */}
        {(status === "pending" || status === "confirmed") && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setCancelOpen(true)}
            sx={{ px: 3, py: 1, borderRadius: 8, fontSize: "0.8rem" }}
          >
            Cancel
          </Button>
        )}

        {/* Show Confirm button only if pending */}
        {status === "pending" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setConfirmOpen(true)}
            sx={{ px: 3, py: 1, borderRadius: 8, fontSize: "0.8rem" }}
          >
            Confirm
          </Button>
        )}
      </Box>

      {/* CONFIRM MODAL */}
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          updateMut.mutate({ id: reservationId, status: "confirmed" });
          setConfirmOpen(false);
        }}
        title="Confirm Reservation"
        description={`Confirm reservation #${reservation.id}?`}
        confirmLabel="Confirm"
        cancelLabel="Back"
      />

      {/* CANCEL MODAL — now includes reason input */}
      <CancelReservationDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={(reason) => {
          updateMut.mutate({
            id: reservationId,
            status: "canceled",
            cancel_reason: reason,
          });
          setCancelOpen(false);
        }}
        itemName={String(reservation.id)}
      />
    </>
  );
}
