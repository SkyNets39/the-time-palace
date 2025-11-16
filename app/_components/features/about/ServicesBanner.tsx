import { Typography, Box, Grid } from "@mui/material";
import IconTextCardVertical from "../../UI/IconTextCardVertical";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const cardItems = [
  {
    icon: <PeopleAltIcon color="secondary" sx={{ fontSize: 45 }} />,
    header: "CONSIGNMENT",
    body: "We manage the sale of your watch through our platform, handling all the details for you.",
  },
  {
    icon: <CurrencyExchangeIcon color="secondary" sx={{ fontSize: 45 }} />,
    header: "DIRECT SELLING",
    body: "Sell your watch directly to us, and receive immediate payment based on an agreed price.",
  },
  {
    icon: <Inventory2Icon color="secondary" sx={{ fontSize: 45 }} />,
    header: "TRADE-IN",
    body: "Exchange your old watch for credit towards a new one, making upgrading easy.",
  },
  {
    icon: <ShoppingCartCheckoutIcon color="secondary" sx={{ fontSize: 45 }} />,
    header: "PRE-ORDER",
    body: "Request specific models not currently in stock, and we’ll work to find and secure them for you.",
  },
];

export default function ServicesBanner() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        textAlign: "center",
        px: { xs: 1.5, sm: 3, md: 5 },
        py: { xs: 4, sm: 5, md: 8 },
        gap: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
          }}
        >
          What Services We Offer
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            maxWidth: 700,
            mx: "auto",
          }}
        >
          We provide a range of services to meet your luxury watch needs
        </Typography>
      </Box>

      {/* Cards */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        justifyContent="center"
        alignItems="stretch"
      >
        {cardItems.map((item, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, md: 3 }} // 📱 1 col | 🧾 2 col | 💻 4 col
            display="flex"
            justifyContent="center"
          >
            <IconTextCardVertical {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
