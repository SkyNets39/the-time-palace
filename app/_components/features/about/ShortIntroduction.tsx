import { Typography, Box } from "@mui/material";
import Button from "../../UI/Button";

export default function IconTextCardsWithHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        bgcolor: "white",
        textAlign: "center",
        px: { xs: 3, sm: 8, md: 20, lg: 50 }, // 🔹 responsif padding horizontal
        py: { xs: 6, sm: 10, md: 13 }, // 🔹 responsif padding vertical
      }}
    >
      {/* Header */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem" },
          lineHeight: 1.3,
        }}
      >
        Your Trusted Luxury Marketplace
      </Typography>

      {/* Body Text */}
      <Typography
        sx={{
          fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
          lineHeight: 1.8,
          maxWidth: { xs: "100%", sm: "85%", md: "100%" },
          mx: "auto",
        }}
      >
        The Time Palace is the largest luxury watch marketplace and the
        convenient solution to sell, buy and trade your treasured timepiece in
        Indonesia. Managed by professional watch dealer with years of experience
        and vast international networks, we are able to offer you valuable
        advice on the watches you desire, and supply them at great prices to
        you. We welcome you to explore our one-of-a-kind collections.
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        size="large"
        sx={{
          alignSelf: "center",
          p: { xs: 2, sm: 2.5, md: 3 },
          fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
        }}
        href="/collections"
      >
        Explore our collection
      </Button>
    </Box>
  );
}
