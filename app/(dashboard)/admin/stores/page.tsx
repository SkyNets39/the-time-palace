import StoresTable from "@/app/_components/dashboard/stores/StoresTable";
import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <HeaderText
        title="Stores"
        description="Manage your store information and branches."
      />
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <StoresTable />
      </Suspense>
    </>
  );
}
