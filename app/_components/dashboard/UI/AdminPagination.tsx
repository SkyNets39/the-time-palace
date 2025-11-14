// src/app/_components/dashboard/UI/AdminPagination.tsx
"use client";

import { PAGE_SIZE } from "@/app/_constants/variables";
import { Box, Pagination, Stack } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AdminPaginationProps = {
  count: number;
};

export default function AdminPagination({ count }: AdminPaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const totalPages = Math.ceil(count / PAGE_SIZE);
  if (totalPages <= 1) return null;

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        bgcolor: "grey.200",
        border: "1px solid",
        borderColor: "divider",
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
        />
      </Stack>
    </Box>
  );
}
