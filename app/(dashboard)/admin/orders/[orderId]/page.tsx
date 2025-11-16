"use client";

import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Grid,
  Avatar,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import HeaderText from "@/app/_components/dashboard/UI/HeaderText";
import { useState, useMemo } from "react";
import { useOrderById, useUpdateOrderStatus } from "@/app/_hooks/useOrder";
import ConfirmationModal from "@/app/_components/dashboard/UI/ConfirmationModal";
import { formatUSD } from "@/app/_utils/currencyFormat";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.orderId);

  const { data: order, isLoading } = useOrderById(orderId);
  const updateMut = useUpdateOrderStatus();
  const [refundOpen, setRefundOpen] = useState(false);

  //  Calculate subtotal, warranty, and total
  const { subtotal, warranty, total } = useMemo(() => {
    if (!order?.items?.length) return { subtotal: 0, warranty: 0, total: 0 };

    const subtotalCalc = order.items.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    const hasWarranty = Boolean(order.warranty_expired_at);
    const warrantyCalc = hasWarranty ? subtotalCalc * 0.05 : 0;

    return {
      subtotal: subtotalCalc,
      warranty: warrantyCalc,
      total: subtotalCalc + warrantyCalc,
    };
  }, [order]);

  if (isLoading || !order) return null;

  return (
    <Box>
      {/* HEADER */}
      <HeaderText
        title={`Order ID: ${order.order_id}`}
        description={`Created on ${new Date(
          order.created_at
        ).toLocaleDateString("id-ID")}`}
      />

      {/* ORDER ITEMS SECTION */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Order Items
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* WARRANTY INFO */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Warranty Expired:{" "}
            {order.warranty_expired_at
              ? new Date(order.warranty_expired_at).toLocaleDateString("id-ID")
              : "-"}
          </Typography>
        </Box>

        {/* LIST OF WATCHES */}
        <Grid container spacing={2} mb={5}>
          {order.items?.map((item) => (
            <Grid
              size={{ xs: 12 }}
              key={item.watch_id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={item.image || "/placeholder.png"}
                  alt={item.watch_name}
                  variant="rounded"
                  sx={{ width: 56, height: 56, borderRadius: 2 }}
                >
                  {!item.image && (
                    <Typography variant="caption" color="text.secondary">
                      No Image
                    </Typography>
                  )}
                </Avatar>
                <Typography variant="body1" fontWeight={500}>
                  {item.watch_name}
                </Typography>
              </Box>

              <Typography fontWeight={600}>{formatUSD(item.price)}</Typography>
            </Grid>
          ))}
        </Grid>

        {/* ORDER SUMMARY */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatUSD(subtotal)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Warranty (5%)
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatUSD(warranty)}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="body2" color="text.secondary">
            Total Amount
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {formatUSD(total)}
          </Typography>
        </Box>
      </Paper>

      {/* CUSTOMER INFO SECTION */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Customer Information
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box>
          <CustomerInfoLine field="Name" value={order.customer_name} />
          <CustomerInfoLine field="Email" value={order.customer_email} />
          <CustomerInfoLine field="Phone" value={order.phone ?? "-"} />
          <CustomerInfoLine field="Status" value={order.status} />
        </Box>
      </Paper>

      {/* ACTION BUTTONS */}
      <Box display="flex" gap={2} mt={2}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          sx={{ px: 3, py: 1, borderRadius: 8, fontSize: "0.8rem" }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setRefundOpen(true)}
          disabled={order.status === "refunded"}
          sx={{ px: 3, py: 1, borderRadius: 8, fontSize: "0.8rem" }}
        >
          Refund
        </Button>
      </Box>

      {/* CONFIRM REFUND MODAL */}
      <ConfirmationModal
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        onConfirm={() => {
          updateMut.mutate({ orderId, status: "refunded" });
          setRefundOpen(false);
        }}
        title="Confirm Refund"
        description={`Are you sure you want to refund order #${order.order_id}?`}
        confirmLabel="Refund"
        cancelLabel="Cancel"
      />
    </Box>
  );
}

/* Subcomponent for clean info lines */
function CustomerInfoLine({
  field,
  value,
}: {
  field: string;
  value: string | null;
}) {
  const isStatus = field.toLowerCase() === "status";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {field}
      </Typography>
      {isStatus ? (
        <Typography
          variant="body1"
          sx={{
            color:
              value?.toLowerCase() === "completed"
                ? "success.light"
                : value?.toLowerCase() === "refunded"
                ? "error.light"
                : "text.primary",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {value}
        </Typography>
      ) : (
        <Typography variant="body1">{value}</Typography>
      )}
    </Box>
  );
}
