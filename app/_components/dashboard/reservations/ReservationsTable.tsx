// src/app/_components/dashboard/reservations/ReservationsTable.tsx
"use client";

import { useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import AdminTable from "@/app/_components/dashboard/UI/AdminTable";
import AdminPagination from "@/app/_components/dashboard/UI/AdminPagination";
import {
  useReservations,
  useUpdateReservation,
} from "@/app/_hooks/useReservations";
import { format } from "date-fns";
import ActionMenu, {
  ActionItem,
} from "@/app/_components/dashboard/UI/ActionMenu";
import CancelReservationDialog from "./CancelReservationDialog";
import ConfirmationModal from "../UI/ConfirmationModal";
import { getReservationStatusColor } from "@/app/_constants/semanticColor";
import { ReservationRow } from "@/app/_types";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export default function ReservationsTable() {
  const { reservations, count, isLoading } = useReservations();
  const updateReservation = useUpdateReservation();

  const [confirmOpenFor, setConfirmOpenFor] = useState<number | null>(null);
  const [cancelOpenFor, setCancelOpenFor] = useState<number | null>(null);

  function handleConfirm(id: number) {
    setConfirmOpenFor(id);
  }

  async function doConfirm(id: number) {
    await updateReservation.mutateAsync({ id, status: "confirmed" });
    setConfirmOpenFor(null);
  }

  function handleCancel(id: number) {
    setCancelOpenFor(id);
  }

  async function doCancel(id: number, reason: string) {
    await updateReservation.mutateAsync({
      id,
      status: "canceled",
      cancel_reason: reason,
    });
    setCancelOpenFor(null);
  }

  const columns = [
    { key: "id", label: "Reservation ID", width: 230 },
    {
      key: "watch_id",
      label: "Watch ID",
      render: (row: ReservationRow) => (
        <Typography variant="body2" fontWeight={600}>
          {row.watch_id}
        </Typography>
      ),
    },
    {
      key: "full_name",
      label: "Client",
      render: (row: ReservationRow) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.full_name ?? "-"}
          </Typography>
        </Box>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: ReservationRow) => (
        <Typography variant="body2" fontWeight={500}>
          {row.phone ?? "-"}
        </Typography>
      ),
    },
    {
      key: "reservation_date",
      label: "Date",
      render: (row: ReservationRow) => {
        if (!row.reservation_date) return "-";
        try {
          const d = new Date(row.reservation_date);
          return (
            <Typography variant="body2" fontWeight={600}>
              {format(d, "dd-MM-yyyy")}
            </Typography>
          );
        } catch {
          return <Typography>{row.reservation_date}</Typography>;
        }
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: ReservationRow) => {
        const { bg, color } = getReservationStatusColor(row.status);
        return (
          <Chip
            label={row.status ?? "Unknown"}
            sx={{
              width: 110,
              py: 0.5,
              fontWeight: 600,
              textTransform: "capitalize",
              border: "1px solid",
              bgcolor: bg,
              color: color,
            }}
          />
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (row: ReservationRow) => {
        const status = (row.status ?? "").toLowerCase();
        const actions: ActionItem[] = [];

        // ✅ Gunakan href untuk navigation
        actions.push({
          icon: <VisibilityOutlinedIcon fontSize="small" />,
          label: "See details",
          href: `/admin/reservations/${row.id}`, // ✅ Gunakan href
        });

        // show "Confirm" only if pending
        if (status === "pending") {
          actions.push({
            icon: <CheckCircleOutlinedIcon fontSize="small" />,
            label: "Confirm",
            color: "primary",
            onClick: () => handleConfirm(row.id), // ✅ Tetap pakai onClick
          });
        }

        // show "Cancel" when pending or confirmed
        if (status === "pending" || status === "confirmed") {
          actions.push({
            icon: <CancelOutlinedIcon color="error" fontSize="small" />,
            label: "Cancel",
            color: "error",
            onClick: () => handleCancel(row.id), // ✅ Tetap pakai onClick
          });
        }

        return <ActionMenu actions={actions} size="small" />;
      },
      align: "right" as const,
      width: 80,
    },
  ];

  return (
    <>
      <Box mt={2}>
        <AdminTable<ReservationRow>
          columns={columns}
          rows={reservations || []}
          isLoading={isLoading}
          emptyMessage="No reservations found."
        />
      </Box>

      <Box mt={2}>
        <AdminPagination count={count} />
      </Box>

      {/* Confirm modal */}
      <ConfirmationModal
        open={confirmOpenFor !== null}
        onClose={() => setConfirmOpenFor(null)}
        onConfirm={() => {
          if (confirmOpenFor !== null) doConfirm(confirmOpenFor);
        }}
        title="Confirm Reservation"
        description={
          confirmOpenFor
            ? `Are you sure you want to confirm reservation #${confirmOpenFor}?`
            : ""
        }
        confirmLabel="Confirm"
      />

      {/* Cancel modal with reason input */}
      <CancelReservationDialog
        open={cancelOpenFor !== null}
        onClose={() => setCancelOpenFor(null)}
        onConfirm={(reason) => {
          if (cancelOpenFor !== null) doCancel(cancelOpenFor, reason);
        }}
        itemName={cancelOpenFor ? String(cancelOpenFor) : undefined}
      />
    </>
  );
}
