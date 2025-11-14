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
  Box,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  reservations: {
    id: number;
    status: string;
    reservation_date: string;
    watch_listings: { name: string; image: string | null };
  }[];
};

export default function ReservationTable({ reservations }: Props) {
  const router = useRouter();

  if (!reservations || reservations.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        You don&apos;t have any reservations yet.
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        borderRadius: 0,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",

        // ✅ Hide scrollbar for cleaner look (optional)
        "&::-webkit-scrollbar": {
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 3,
        },
      }}
    >
      <Table
        sx={{
          minWidth: { xs: 500, sm: 650 }, // ✅ Smaller min-width di mobile
          "& th, & td": {
            whiteSpace: "nowrap",
            // ✅ Responsive padding
            px: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 1, sm: 1.5, md: 2 },
          },
        }}
      >
        {/* ===== HEADER ===== */}
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "rgba(0,0,0,0.03)",
            }}
          >
            <TableCell>
              <Typography
                fontWeight={600}
                color="text.primary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // ✅ 12px, 14px, 16px
                }}
              >
                ID
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                fontWeight={600}
                color="text.primary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                Watch
              </Typography>
            </TableCell>

            <TableCell align="center">
              <Typography
                fontWeight={600}
                color="text.primary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                Status
              </Typography>
            </TableCell>

            <TableCell align="right">
              <Typography
                fontWeight={600}
                color="text.primary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                Date
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        {/* ===== BODY ===== */}
        <TableBody>
          {reservations.map((res) => (
            <TableRow
              key={res.id}
              hover
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
              onClick={() => router.push(`/my-reservations/${res.id}`)}
            >
              {/* Reservation ID */}
              <TableCell sx={{ width: { xs: "15%", md: "10%" } }}>
                <Typography
                  color="text.secondary"
                  fontWeight={500}
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // ✅ 12px, 14px, 16px
                  }}
                >
                  #{res.id}
                </Typography>
              </TableCell>

              {/* Watch Info */}
              <TableCell sx={{ width: { xs: "45%", md: "50%" } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 1.5, md: 2 }, // ✅ Smaller gap mobile
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: 40, sm: 50, md: 60 }, // ✅ 40px, 50px, 60px
                      height: { xs: 40, sm: 50, md: 60 },
                      borderRadius: { xs: 1, md: 2 }, // ✅ Smaller radius mobile
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={res.watch_listings?.image || "/placeholder.jpg"}
                      alt={res.watch_listings?.name || "Watch"}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>

                  {/* Watch Name */}
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    noWrap
                    sx={{
                      fontSize: { xs: "0.813rem", sm: "0.95rem", md: "1rem" }, // ✅ 13px, 15px, 16px
                      maxWidth: { xs: 120, sm: 180, md: "none" }, // ✅ Limit width di mobile
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {res.watch_listings?.name || "Unknown Watch"}
                  </Typography>
                </Box>
              </TableCell>

              {/* Status */}
              <TableCell
                align="center"
                sx={{ width: { xs: "20%", md: "20%" } }}
              >
                <Typography
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // ✅ 12px, 14px, 16px
                    color:
                      res.status.toLowerCase() === "confirmed"
                        ? "success.main"
                        : res.status.toLowerCase() === "pending"
                        ? "warning.main"
                        : "text.secondary",
                  }}
                >
                  {res.status}
                </Typography>
              </TableCell>

              {/* Date */}
              <TableCell align="right" sx={{ width: { xs: "20%", md: "20%" } }}>
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // ✅ 12px, 14px, 16px
                  }}
                >
                  {new Date(res.reservation_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
