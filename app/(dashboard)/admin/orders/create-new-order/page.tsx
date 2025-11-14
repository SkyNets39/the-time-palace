"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Paper,
  IconButton,
  Stack,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAvailableWatchListings } from "@/app/_hooks/useWatchListings";
import { useCreateOrder } from "@/app/_hooks/useOrder";
import { formatUSD } from "@/app/_utils/currencyFormat";

type ProductRow = {
  watch_id: number | string;
};

type FormValues = {
  customer_name: string;
  customer_email: string;
  phone: string;
  warranty: boolean;
  items: ProductRow[];
};

export default function CreateNewOrderPage() {
  const { listings = [], isLoading } = useAvailableWatchListings();
  const createOrderMut = useCreateOrder();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      customer_name: "",
      customer_email: "",
      phone: "",
      warranty: false,
      items: [{ watch_id: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const warranty = watch("warranty");
  const formItems = watch("items");

  // global local state: set of selected watch ids (numbers)
  const [selectedSet, setSelectedSet] = useState<Set<number>>(new Set());

  // Keep selectedSet in sync with formItems as a fallback (safe)
  useEffect(() => {
    const s = new Set<number>();
    formItems.forEach((it) => {
      const id = it?.watch_id;
      if (id !== undefined && id !== null && id !== "") {
        s.add(Number(id));
      }
    });
    setSelectedSet(s);
  }, [formItems]);

  const selectedWatchIds = useMemo(
    () =>
      formItems
        .map((it) => (it?.watch_id ? Number(it.watch_id) : null))
        .filter(Boolean) as number[],
    [formItems]
  );

  const selectedWatches = useMemo(
    () => listings.filter((w) => selectedWatchIds.includes(Number(w.id))),
    [listings, selectedWatchIds]
  );

  const subTotal = selectedWatches.reduce((sum, w) => sum + Number(w.price), 0);
  const warrantyCost = warranty ? subTotal * 0.05 : 0;
  const totalAmount = subTotal + warrantyCost;

  const handleAddProduct = () => append({ watch_id: "" });

  const onSubmit = (data: FormValues) => {
    const watch_ids = data.items
      .map((it) => (it.watch_id === "" ? null : Number(it.watch_id)))
      .filter(Boolean) as number[];

    if (watch_ids.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const payload = {
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      phone: data.phone || "",
      warranty: data.warranty,
      watch_ids,
    };

    createOrderMut.mutate(payload);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Create New Order
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* CUSTOMER CARD */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Customer Information
          </Typography>

          <Controller
            name="customer_name"
            control={control}
            rules={{ required: "Customer name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Customer Name"
                fullWidth
                size="small"
                margin="normal"
                error={!!errors.customer_name}
                helperText={errors.customer_name?.message}
              />
            )}
          />

          <Controller
            name="customer_email"
            control={control}
            rules={{
              required: "Customer email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Customer Email"
                fullWidth
                margin="normal"
                error={!!errors.customer_email}
                helperText={errors.customer_email?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Phone" fullWidth margin="normal" />
            )}
          />

          <Controller
            name="warranty"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Add 5-Year Warranty (5% of subtotal)"
              />
            )}
          />
        </Paper>

        {/* ORDER ITEMS CARD */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Order Items
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {fields.map((fieldItem, index) => {
            const selectedId = formItems[index]?.watch_id;

            return (
              <Box
                key={fieldItem.id}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ mb: 1.5 }}
              >
                <Box flex={1}>
                  <Controller
                    name={`items.${index}.watch_id`}
                    control={control}
                    rules={{ required: "Select a product" }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.items?.[index]?.watch_id}
                      >
                        <InputLabel id={`watch-${index}`}>
                          Choose Product
                        </InputLabel>
                        <Select
                          labelId={`watch-${index}`}
                          value={field.value === "" ? "" : field.value}
                          label="Choose Product"
                          onChange={(e) => {
                            const raw = e.target.value;
                            const newVal = raw === "" ? "" : Number(raw);

                            // optimistic update of selectedSet:
                            setSelectedSet((prev) => {
                              const next = new Set(prev);
                              // remove previous selected for this row (if any)
                              if (
                                selectedId !== undefined &&
                                selectedId !== "" &&
                                selectedId !== null
                              ) {
                                next.delete(Number(selectedId));
                              }
                              // add new selected (if not empty)
                              if (
                                newVal !== "" &&
                                newVal !== null &&
                                newVal !== undefined
                              ) {
                                next.add(Number(newVal));
                              }
                              return next;
                            });

                            // propagate to RHF
                            field.onChange(newVal === "" ? "" : Number(newVal));
                          }}
                        >
                          <MenuItem value="">Choose from catalog</MenuItem>
                          {listings.map((w) => {
                            // disable if taken by other rows according to global selectedSet,
                            // but allow the option if it's current selected value in this row.
                            const isTakenByOther =
                              selectedSet.has(Number(w.id)) &&
                              Number(selectedId) !== Number(w.id);

                            return (
                              <MenuItem
                                key={w.id}
                                value={w.id}
                                disabled={isTakenByOther}
                              >
                                #{w.id} | {w.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {errors.items?.[index]?.watch_id && (
                          <FormHelperText>
                            {errors.items[index]?.watch_id?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                {/* Price */}
                <Box width={160} textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {(() => {
                      const id = formItems[index]?.watch_id;
                      if (!id) return "-";
                      const watch = listings.find(
                        (l) => Number(l.id) === Number(id)
                      );
                      return watch ? formatUSD(Number(watch.price)) : "-";
                    })()}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => {
                    // remove and optimistic update of selectedSet
                    const removedId = formItems[index]?.watch_id;
                    remove(index);
                    if (
                      removedId !== undefined &&
                      removedId !== null &&
                      removedId !== ""
                    ) {
                      setSelectedSet((prev) => {
                        const next = new Set(prev);
                        next.delete(Number(removedId));
                        return next;
                      });
                    }
                  }}
                  disabled={fields.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}

          <Stack direction="row" spacing={2} mt={2}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              variant="outlined"
            >
              Add Product
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />
          <Box textAlign="right">
            <Typography variant="body2">
              Subtotal: {formatUSD(subTotal)}
            </Typography>
            <Typography variant="body2">
              Warranty: {formatUSD(warrantyCost)}
            </Typography>
            <Typography variant="h6" fontWeight={700} mt={1}>
              Total: {formatUSD(totalAmount)}
            </Typography>
          </Box>
        </Paper>

        {/* ACTION BUTTONS */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createOrderMut.isPending || isSubmitting}
          >
            {createOrderMut.isPending || isSubmitting
              ? "Creating..."
              : "Create Order"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
