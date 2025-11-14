"use client";

import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import ListingsTableOperation from "@/app/_components/dashboard/listings/ListingsTableOperations";
import ListingsTable from "@/app/_components/dashboard/listings/ListingsTable";
import { Suspense } from "react";
import { Skeleton } from "@mui/material";

export default function Page() {
  return (
    <>
      <HeaderText
        title="All Watch Listings"
        description="Filter and manage your product listings."
      />
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <ListingsTableOperation />
      </Suspense>
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <ListingsTable />
      </Suspense>
    </>
  );
}
