import { Box, Typography, Button, Divider } from "@mui/material";
import Image from "next/image";

import { getServerSession } from "@/app/_services/apiAuth/server";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import LinkText from "@/app/_components/UI/LinkText";
import Link from "next/link";
import { slugify } from "@/app/_utils/slugify";
import { formatDisplayName } from "@/app/_utils/searchUtils";
import { getWatchListing } from "@/app/_services/apiWatchListings/server";
import { getStore } from "@/app/_services/apiStores/server";
import { getActiveReservation } from "@/app/_services/apiReservations/server";

type Props = {
  params: Promise<{ watchId: number }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const session = await getServerSession();
  const userId = session?.id || null;
  const { watchId } = await params;

  // Fetch data
  const watch = await getWatchListing(watchId);
  const store = watch?.store ? await getStore(watch.store) : null;

  let activeReservation: { reservation_date: string } | null = null;
  if (userId) {
    activeReservation = await getActiveReservation(userId, watchId);
  }

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

  return (
    <Box sx={{ px: { xs: 2, md: 8 }, mb: 5 }}>
      <Breadcrumbs />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-start" },
          justifyContent: "space-between",
          gap: { xs: 4, md: 6 },
          backgroundColor: "background.default",
        }}
      >
        {/* LEFT COLUMN */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0, // biar gak overflow
          }}
        >
          {/* Image */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              position: "relative",
              p: { xs: 2, md: 4 },
            }}
          >
            <Image
              src={watch.image || "/placeholder.jpg"}
              alt={watch.name}
              width={800}
              height={400}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Description */}
          <Box
            id="description-section"
            sx={{
              backgroundColor: "background.paper",
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Description
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {watch.description || "No description available."}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: 1.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Size:
              </Typography>
              <Typography variant="body2">
                {watch.size ? `${watch.size}mm` : "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                With Box:
              </Typography>
              <Typography variant="body2">
                {watch.with_box ? "Yes" : "No"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Gender:
              </Typography>
              <Typography variant="body2">{watch.gender || "-"}</Typography>

              <Typography variant="body2" color="text.secondary">
                Condition:
              </Typography>
              <Typography variant="body2">{watch.condition || "-"}</Typography>
            </Box>
          </Box>
        </Box>

        {/* RIGHT COLUMN (STICKY BOX) */}
        <Box
          sx={{
            flex: 1,
            position: { md: "sticky" },
            top: { md: 32 }, // ~2rem offset
            alignSelf: "flex-start",
            backgroundColor: "background.paper",
            p: { xs: 3, md: 4 },
            height: "fit-content",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Watch Title */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 1,
                fontSize: { xs: "1.6rem", md: "2.2rem" },
                fontWeight: 600,
              }}
            >
              {watch.name}
            </Typography>
            <LinkText
              subtitle
              href={`/collections/brand/${slugify(watch.brand)}`}
            >
              {formatDisplayName(watch.brand)}
            </LinkText>
          </Box>

          {/* Price */}
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.75rem",
              color: "text.primary",
              mb: 2,
            }}
          >
            ${watch.price.toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Details */}
          <Typography variant="body2" color="text.secondary">
            Year:
          </Typography>
          <Typography variant="body1">{watch.year || "-"}</Typography>

          <Typography variant="body2" color="text.secondary">
            Condition:
          </Typography>
          <Typography variant="body1">{watch.condition || "-"}</Typography>

          <Typography
            variant="body1"
            color={watch.status === "available" ? "success.main" : "error.main"}
            sx={{ mb: 3, textTransform: "capitalize" }}
          >
            {watch.status}
          </Typography>

          {/* Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                py: 2,
                borderRadius: 0,
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Add to Wishlist
            </Button>

            {activeReservation ? (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled
                sx={{
                  py: 2,
                  borderRadius: 0,
                  boxShadow: "none",
                  textTransform: "none",
                }}
              >
                You have reserved this watch for{" "}
                {new Date(
                  activeReservation.reservation_date
                ).toLocaleDateString()}
              </Button>
            ) : (
              <Button
                LinkComponent={Link}
                href={`/collections/${watchId}/reservation`}
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 0,
                  boxShadow: "none",
                  textTransform: "none",
                }}
              >
                Reserve Now
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Store Info */}
          <Typography variant="body2" color="text.secondary">
            Pickup Location:
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {store?.name ?? "-"}
          </Typography>

          {store?.address && (
            <>
              <Typography variant="body2" color="text.secondary">
                Address:
              </Typography>
              <Typography variant="body1">{store.address}</Typography>
            </>
          )}

          {store?.phone && (
            <>
              <Typography variant="body2" color="text.secondary">
                Phone:
              </Typography>
              <Typography variant="body1">{store.phone}</Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
