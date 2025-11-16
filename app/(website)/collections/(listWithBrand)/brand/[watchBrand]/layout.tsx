import Filter from "@/app/_components/layout/Filter";
import { Box } from "@mui/material";
import { ReactNode, Suspense } from "react";

import Loading from "@/app/_components/UI/Loading";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import { getFilterOptionsForBrand } from "@/app/_services/apiWatchListings/server";

export default async function BrandLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ watchBrand: string }>;
}) {
  const { watchBrand } = await params;
  const options = await getFilterOptionsForBrand(watchBrand);

  // 🔥 Filter out other brands, keep only current brand
  const brandFilteredOptions = {
    ...options,
    brands: [watchBrand],
    years: options.years.map(Number),
  };

  return (
    <Box
      sx={{
        mx: { xs: 1.5, sm: 2.5, md: 5 }, // responsive margin
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Breadcrumbs />

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* 🔹 Sidebar Filter (Desktop Only) */}
        <Box
          sx={{
            flex: "0 0 20%",
            display: { xs: "none", md: "block" }, // hide on mobile/tablet
          }}
        >
          <Suspense fallback={<Loading />}>
            <Filter options={brandFilteredOptions} lockedBrand={watchBrand} />
          </Suspense>
        </Box>

        {/* 🔹 Right Content */}
        <Suspense fallback={<Loading />}>
          <Box sx={{ flex: 1 }}>{children}</Box>
        </Suspense>
      </Box>
    </Box>
  );
}
