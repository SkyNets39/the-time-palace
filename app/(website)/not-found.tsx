import { Box, Typography } from "@mui/material";
import Button from "../_components/UI/Button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography variant="h2" fontWeight={700} mb={1}>
        404
      </Typography>
      <Typography variant="h5" mb={3}>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        component={Link}
        href="/"
        variant="contained"
        sx={{ py: 2, px: 5 }}
      >
        Back to Home
      </Button>
    </Box>
  );
}
