import ReservationsTable from "@/app/_components/dashboard/reservations/ReservationsTable";
import ReservationsTableOperation from "@/app/_components/dashboard/reservations/ReservationsTableOperation";
import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <HeaderText
        title="Reservations"
        description="Manage and monitor customer reservations."
      />
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <ReservationsTableOperation />
      </Suspense>
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <ReservationsTable />
      </Suspense>
    </>
  );
}
