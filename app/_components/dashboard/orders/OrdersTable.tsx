"use client";

import { useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import AdminTable from "@/app/_components/dashboard/UI/AdminTable";
import AdminPagination from "@/app/_components/dashboard/UI/AdminPagination";
import ActionMenu from "@/app/_components/dashboard/UI/ActionMenu";
import { useOrders, useUpdateOrderStatus } from "@/app/_hooks/useOrder";
import ConfirmationModal from "../UI/ConfirmationModal";
import { formatUSD } from "@/app/_utils/currencyFormat";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import { getOrderStatusColor } from "@/app/_constants/semanticColor";

type OrderRow = {
  order_id: number;
  customer_name: string;
  customer_email: string;
  phone: string | null;
  amount: number;
  status: "completed" | "refunded";
  created_at: string;
};

export default function OrdersTable() {
  const { orders, count, isLoading } = useOrders();
  const updateMut = useUpdateOrderStatus();

  const [refundTarget, setRefundTarget] = useState<OrderRow | null>(null);

  const handleRefundConfirm = () => {
    if (!refundTarget) return;
    updateMut.mutate({
      orderId: refundTarget.order_id,
      status: "refunded",
    });
    setRefundTarget(null);
  };

  const columns = [
    { key: "order_id", label: "ID" },
    {
      key: "customer_name",
      label: "Customer",
      render: (row: OrderRow) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.customer_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.customer_email}
          </Typography>
        </Box>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: OrderRow) => (
        <Typography variant="body2">{row.phone || "-"}</Typography>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: OrderRow) => (
        <Typography variant="body2" fontWeight={600}>
          {formatUSD(row.amount)}
        </Typography>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row: OrderRow) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString("id-ID")}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: OrderRow) => {
        const { bg, color } = getOrderStatusColor(row.status);
        return (
          <Chip
            label={row.status}
            sx={{
              px: 1,
              textTransform: "capitalize",
              fontSize: "0.5rem",
              fontWeight: 600,
              bgcolor: bg,
              color,
              border: "1px solid",
            }}
          />
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (row: OrderRow) => (
        <ActionMenu
          actions={[
            {
              icon: <VisibilityOutlinedIcon fontSize="small" />,
              label: "View Details",
              href: `/admin/orders/${row.order_id}`, // ✅ Gunakan href
            },
            {
              icon: (
                <CurrencyExchangeOutlinedIcon fontSize="small" color="error" />
              ),
              label: "Refund",
              color: "error",
              onClick: () => setRefundTarget(row), // ✅ Tetap pakai onClick untuk action
            },
          ]}
        />
      ),
      align: "right" as const,
    },
  ];

  return (
    <>
      <AdminTable<OrderRow>
        columns={columns}
        rows={
          orders?.map((o) => ({
            order_id: o.order_id,
            customer_name: o.customer_name,
            customer_email: o.customer_email,
            phone: o.phone,
            amount: o.amount,
            status: o.status,
            created_at: o.created_at,
          })) ?? []
        }
        isLoading={isLoading}
        emptyMessage="No orders found."
      />

      <AdminPagination count={count} />

      <ConfirmationModal
        open={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        onConfirm={handleRefundConfirm}
        title="Confirm Refund"
        description={`Are you sure you want to refund order #${refundTarget?.order_id}?`}
        confirmLabel="Refund"
        cancelLabel="Cancel"
      />
    </>
  );
}
