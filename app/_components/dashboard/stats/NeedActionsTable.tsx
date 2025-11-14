"use client";

import { Box, Typography, Chip } from "@mui/material";
import { format } from "date-fns";
import AdminTable from "@/app/_components/dashboard/UI/AdminTable";
import { useReservations } from "@/app/_hooks/useReservations";
import { getReservationStatusColor } from "@/app/_constants/semanticColor";
import { ReservationRow } from "@/app/_types";
import ActionMenu, {
  ActionItem,
} from "@/app/_components/dashboard/UI/ActionMenu";
import { useRouter } from "next/navigation";

export default function NeedActionsTable() {
  const { reservations, isLoading } = useReservations();
  const pendingReservations = reservations.filter(
    (r) => r.status?.toLowerCase() === "pending"
  );
  const router = useRouter();

  const columns = [
    {
      key: "watch_id",
      label: "Watch",
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
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ wordBreak: "break-all" }}
          >
            {row.phone ?? "-"}
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
      align: "right" as const,
      width: 60,
      render: (row: ReservationRow) => {
        const actions: ActionItem[] = [
          {
            label: "See details",
            onClick: () => router.push(`/admin/reservations/${row.id}`),
          },
        ];
        return <ActionMenu actions={actions} size="small" />;
      },
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        p: 3,
        height: 240,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" mb={1}>
        Need Actions
      </Typography>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <AdminTable<ReservationRow>
          columns={columns}
          rows={pendingReservations}
          isLoading={isLoading}
          emptyMessage="No pending reservations."
        />
      </Box>
    </Box>
  );
}
