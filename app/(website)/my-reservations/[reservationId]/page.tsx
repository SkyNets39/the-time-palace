import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import { getReservationDetail } from "@/app/_services/apiReservations/server";
import { requireReservationOwner } from "@/app/_services/apiAuth/server";

type Props = {
  params: Promise<{ reservationId: string }>;
};

export default async function ReservationDetailPage({ params }: Props) {
  const { reservationId } = await params;
  const reservationIdNum = Number(reservationId);
  await requireReservationOwner(reservationIdNum);
  const reservation = await getReservationDetail(reservationIdNum);

  if (!reservation) {
    notFound();
  }

  const { watch, store } = reservation;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      {/* 🔹 Breadcrumbs wrapper */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200, // batas keseluruhan layout
          px: { xs: 1, md: 20 }, // responsif agar sejajar dengan CardContent
          mb: 1.5,
        }}
      >
        <Breadcrumbs />
      </Box>

      {/* 🔹 Main Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 0,
          boxShadow: "none",
          backgroundColor: "background.paper",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Reservation Detail
            </Typography>
            <Divider />
          </Box>

          {/* Watch Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 3,
              mb: 4,
            }}
          >
            {/* Image */}
            <Box
              sx={{
                width: 140,
                height: 140,
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={watch?.image || "/placeholder.jpg"}
                alt={watch?.name || "Watch"}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </Box>

            {/* Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {watch?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                Condition: {watch?.condition || "-"}
              </Typography>
              {store && (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  Store: {store.name}
                </Typography>
              )}
            </Box>

            {/* Price */}
            {watch?.price && (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  minWidth: "fit-content",
                }}
              >
                ${watch.price.toLocaleString()}
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Reservation Details */}
          <Box sx={{ display: "grid", rowGap: 1.5 }}>
            <Typography variant="body1">
              <strong>Reservation ID:</strong> #{reservation.id}
            </Typography>

            <Typography variant="body1">
              <strong>Full Name:</strong> {reservation.full_name}
            </Typography>

            <Typography variant="body1">
              <strong>Phone:</strong> {reservation.phone}
            </Typography>

            <Typography variant="body1">
              <strong>Reservation Date:</strong>{" "}
              {new Date(reservation.reservation_date).toLocaleDateString()}
            </Typography>

            <Typography variant="body1">
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    reservation.status === "confirmed"
                      ? "#2e7d32"
                      : reservation.status === "pending"
                      ? "#ed6c02"
                      : "#6c757d",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {reservation.status}
              </span>
            </Typography>

            <Typography variant="body1">
              <strong>Created At:</strong>{" "}
              {new Date(reservation.created_at).toLocaleString()}
            </Typography>
          </Box>

          {/* Store Details */}
          {store && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Pickup Location
              </Typography>
              <Typography variant="body1">{store.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {store.address}
              </Typography>
              {store.phone && (
                <Typography variant="body2" color="text.secondary">
                  Phone: {store.phone}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Open: {store.open_days} ({store.open_hours})
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
