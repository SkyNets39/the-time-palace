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
        px: { xs: 2, sm: 5, md: 10, lg: 20 },
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      {/* Header */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" },
          lineHeight: 1.3,
        }}
      >
        Your Trusted Luxury Marketplace
      </Typography>

      {/* Body Text */}
      <Typography
        sx={{
          fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
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
          p: { xs: 1.2, sm: 1.5, md: 2 },
          fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
        }}
        href="/collections"
      >
        Explore our collection
      </Button>
    </Box>
  );
}
