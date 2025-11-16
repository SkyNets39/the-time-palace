"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Props = {
  total: number;
  currentPage: number;
  limit: number;
  route: string;
};

export default function Pagination({
  total,
  currentPage,
  limit,
  route,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  // Helper function to build URL with page param
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${route}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(buildUrl(page));
    });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 3,
        gap: 1,
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Previous Button */}
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          variant="outlined"
          sx={{
            minWidth: "auto",
            px: 2,
          }}
        >
          Previous
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <Typography key={`ellipsis-${index}`} sx={{ px: 1 }}>
                ...
              </Typography>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={isActive || isPending}
              variant={isActive ? "contained" : "outlined"}
              sx={{
                minWidth: 40,
                height: 40,
              }}
            >
              {pageNum}
            </Button>
          );
        })}

        {/* Next Button */}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          variant="outlined"
          sx={{
            minWidth: "auto",
            px: 2,
          }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
}
