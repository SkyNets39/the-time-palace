// app/collections/layout.tsx
import Filter from "@/app/_components/layout/Filter";
import { Box } from "@mui/material";
import { ReactNode, Suspense } from "react";
import Loading from "@/app/_components/UI/Loading";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import { getFilterOptions } from "@/app/_services/apiWatchListings/server";

export default async function CollectionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const optionsRaw = await getFilterOptions();

  // ✅ Normalize the years type
  const options = {
    ...optionsRaw,
    years: optionsRaw.years.map(Number),
  };

  return (
    <Box
      sx={{
        mx: { xs: 1.5, sm: 2, md: 8 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Breadcrumbs />
      <Box
        sx={{
          display: "flex",
          gap: { xs: 0, md: 3 },
        }}
      >
        {/* ⛔ Filter hanya muncul di laptop */}
        <Box
          sx={{
            flex: "0 0 20%",
            display: { xs: "none", md: "block" },
          }}
        >
          <Suspense fallback={<Loading />}>
            <Filter options={options} />
          </Suspense>
        </Box>

        {/* Right Side (children injected here) */}
        <Suspense fallback={<Loading />}>
          <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
        </Suspense>
      </Box>
    </Box>
  );
}
