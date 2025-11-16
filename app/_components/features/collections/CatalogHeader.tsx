// src/app/_components/features/collections/CatalogHeader.tsx
import { Box, Typography } from "@mui/material";
import Sort from "@/app/_components/UI/Sort";
import FilterDrawer from "@/app/_components/UI/MobileFilter";
import { getFilterOptions } from "@/app/_services/apiWatchListings/server";

type Props = {
  headerText?: string;
  brand?: string;
};

export default async function CatalogHeader({
  headerText = "Luxury Watches Collections",
  brand,
}: Props) {
  const shouldShowHeader = !brand;
  const rawOptions = await getFilterOptions();

  // ✅ Normalize years to number[]
  const options = {
    ...rawOptions,
    years: rawOptions.years.map(Number), // Convert all to numbers
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fefefe",
        outline: "1px solid",
        outlineColor: "divider",
        gap: 3,
        px: { xs: 1.5, sm: 2.5, md: 4 },
        py: { xs: 1.2, sm: 2 },
      }}
    >
      {/* Title */}
      {shouldShowHeader && (
        <Typography
          variant="h2"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" } }}
        >
          {headerText}
        </Typography>
      )}

      {/* Toolbar (Filter + Sort) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Filter Button only visible on mobile & tablet */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <FilterDrawer options={options} />
        </Box>
        <Box sx={{ flex: 1, display: "flex" }}>
          <Sort />
        </Box>
      </Box>
    </Box>
  );
}
