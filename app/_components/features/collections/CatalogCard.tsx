// src/components/molecules/CatalogCard.tsx
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import Image from "next/image";
import { slugify } from "@/app/_utils/slugify";
import { formatUSD } from "@/app/_utils/currencyFormat";
import LinkText from "../../UI/LinkText";
import { formatDisplayName } from "@/app/_utils/searchUtils";
import { WatchListing } from "@/app/_types";

export default function CatalogCard({ data }: { data: WatchListing }) {
  const { id, brand, name, price, status, image } = data;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: 0,
        outline: "1px solid",
        outlineColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "none",
      }}
    >
      {/* Image area */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 160, sm: 200, md: 240 }, // ✅ Responsive image height
          bgcolor: image ? "transparent" : "grey.300",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={`${brand} ${name}`}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
            style={{
              objectFit: "contain",
              padding: 8,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No Image
          </Typography>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          px: { xs: 1.5, md: 2.5 },
          py: { xs: 1, md: 1.5 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 0.5, md: 1 }, // ✅ Kurangi gap di mobile

          // ✅ CRITICAL: Override MUI default padding
          "&:last-child": { pb: { xs: 1, md: 1.5 } },
        }}
      >
        {/* Brand */}
        <LinkText
          subtitle
          href={`/collections/brand/${slugify(brand)}`}
          sx={{
            fontSize: { xs: "0.6rem", md: "0.8rem" }, // ✅ Slightly bigger
            lineHeight: { xs: 1.3, md: 1.5 }, // ✅ Tighter line height
          }}
        >
          {formatDisplayName(brand)}
        </LinkText>

        {/* Name */}
        <LinkText
          title
          href={`/collections/${id}`}
          sx={{
            fontSize: { xs: "0.85rem", md: "1.3rem" }, // ✅ Slightly bigger
            lineHeight: { xs: 1.3, md: 1.4 }, // ✅ Tighter line height
            mb: { xs: 0.5, md: 0 }, // ✅ Small margin bottom di mobile
          }}
        >
          {name}
        </LinkText>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1, md: 2 }, // ✅ Kurangi gap di mobile
            mt: { xs: 0.5, md: 0 }, // ✅ Small margin top
          }}
        >
          {/* Price */}
          <Typography
            variant="body1"
            color="primary.main"
            fontWeight={600}
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" }, // ✅ Adjust size
              lineHeight: 1.2,
            }}
          >
            {formatUSD(price)}
          </Typography>

          {/* Status */}
          <Chip
            sx={{
              bgcolor: status === "available" ? "success.light" : "error.main",
              color: "#fefefe",
              fontWeight: 500,
              fontSize: { xs: "0.65rem", md: "0.8rem" },
              fontFamily: "sans-serif",
              letterSpacing: "0.1rem",
              textTransform: "capitalize",
              alignSelf: "flex-start",
              height: { xs: 18, md: 22 },
              px: { xs: 0.8, md: 1.5 },
            }}
            label={status}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
