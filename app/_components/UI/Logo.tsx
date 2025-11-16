import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Logo({ admin = false }) {
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <Typography
        variant="h1"
        color="primary"
        sx={{
          fontSize: admin
            ? "1.4rem"
            : {
                xs: "1.05rem",
                sm: "1.3rem",
                md: "1.55rem",
                lg: "1.7rem",
              },
          fontWeight: 700,
          letterSpacing: 0.4,
          lineHeight: 1.15,
          whiteSpace: "nowrap",
        }}
      >
        Time Palace
      </Typography>
    </Box>
  );
}
