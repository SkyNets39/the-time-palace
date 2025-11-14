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
            ? "1.9rem"
            : {
                xs: "1.4rem", // 📱 mobile
                sm: "1.8rem", // 🧾 tablet
                md: "2.2rem", // 💻 laptop
                lg: "2.4rem", // 🖥️ large screen
              },
          fontWeight: 700,
          letterSpacing: 0.5,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        Time Palace
      </Typography>
    </Box>
  );
}
