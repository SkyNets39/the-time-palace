"use client";
import OrdersTable from "@/app/_components/dashboard/orders/OrdersTable";
import OrdersTableOperation from "@/app/_components/dashboard/orders/OrdersTableOperation";
import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import Button from "@/app/_components/UI/Button";
import { Box, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <HeaderText
        title="Orders"
        description="Track and manage all customer orders."
      />
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <OrdersTableOperation />
      </Suspense>
      <Box mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/admin/orders/create-new-order")}
          sx={{
            px: 2.2,
            py: 1.2,
            borderRadius: 5,
            fontSize: "0.8rem",
          }}
        >
          + Create New Order
        </Button>
      </Box>
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <OrdersTable />
      </Suspense>
    </>
  );
}
