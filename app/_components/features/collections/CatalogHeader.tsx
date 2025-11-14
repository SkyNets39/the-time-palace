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
        px: { xs: 2, sm: 4, md: 5 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* Title */}
      {shouldShowHeader && (
        <Typography
          variant="h2"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" } }}
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
