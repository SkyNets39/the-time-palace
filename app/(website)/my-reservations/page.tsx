import { Box, Card, CardContent, Typography } from "@mui/material";
import { requireAuth } from "@/app/_services/apiAuth/server";

import ReservationTable from "@/app/_components/features/reservation/ReservationTable";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import { getProfileName } from "@/app/_services/apiProfileClient/server";
import { getUserReservations } from "@/app/_services/apiReservations/server";

export default async function MyReservationsPage() {
  const user = await requireAuth();
  const [profileName, reservations] = await Promise.all([
    getProfileName(user.id),
    getUserReservations(user.id),
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200, // same as card
          px: 1, // match CardContent padding
        }}
      >
        <Breadcrumbs />
      </Box>

      <Card
        sx={{
          maxWidth: 1200,
          width: "100%",
          borderRadius: 0,
          boxShadow: "none",
          backgroundColor: "background.paper",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 4,
              color: "text.primary",
            }}
          >
            {profileName
              ? `${profileName}'s Reservation History`
              : "Your Reservation History"}
          </Typography>

          <ReservationTable reservations={reservations} />
        </CardContent>
      </Card>
    </Box>
  );
}
