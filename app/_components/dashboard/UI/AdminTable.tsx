"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Skeleton,
} from "@mui/material";
import React from "react";

export type Column<T extends Record<string, unknown>> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
  align?: "left" | "right" | "center";
};

export type AdminTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyMessage?: string;
};

export default function AdminTable<T extends Record<string, unknown>>({
  columns,
  rows,
  isLoading = false,
  emptyMessage = "No data available.",
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <Skeleton variant="rounded" animation={"wave"} height={500}></Skeleton>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="admin table">
        <TableHead sx={{ bgcolor: "grey.200" }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={String(col.key)}
                align={col.align || "left"}
                sx={{ fontWeight: 600, textTransform: "uppercase" }}
                width={col.width}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} hover>
              {columns.map((col) => {
                const value =
                  col.render?.(row) ??
                  (row[col.key as keyof T] as React.ReactNode);

                return (
                  <TableCell key={String(col.key)} align={col.align || "left"}>
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
