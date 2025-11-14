import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import Image from "next/image";
import ReservationForm from "@/app/_components/features/reservation/ReservationForm";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import { getWatchListing } from "@/app/_services/apiWatchListings/server";
import { getStore } from "@/app/_services/apiStores/server";

type Props = {
  params: Promise<{ watchId: string }>;
};

export default async function ReservationPage({ params }: Props) {
  const { watchId } = await params;
  const id = Number(watchId);
  const watch = await getWatchListing(id);

  if (!watch) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Watch not found
        </Typography>
      </Box>
    );
  }

  const store = watch.store ? await getStore(watch.store) : null;

  return (
    <Box sx={{ mx: 8, display: "flex", flexDirection: "column", gap: 2 }}>
      <Breadcrumbs />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor: "background.paper",
            overflow: "hidden",
            py: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {/* 🔹 Header Watch Info */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 3,
                mb: 4,
              }}
            >
              {/* Watch Image */}
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
                  src={watch.image || "/placeholder.jpg"}
                  alt={watch.name}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Watch Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {watch.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  Condition: {watch.condition || "-"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  Store: {store?.name || "-"}
                </Typography>
              </Box>

              {/* Price */}
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
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* 🔹 Reservation Form */}
            <ReservationForm watchId={id} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
