// src/components/organisms/WhyBanner.tsx

import { Typography, Box, Grid } from "@mui/material";
import IconTextCard from "../../UI/IconTextCard";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";

const cardItems = [
  {
    icon: <ShieldOutlinedIcon color="secondary" sx={{ fontSize: 60 }} />,
    header: "Authentic Guarantee",
    body: "We ensure every watch is 100% genuine with our authenticity guarantee",
  },
  {
    icon: <SupportAgentIcon color="secondary" sx={{ fontSize: 60 }} />,
    header: "Customer Service",
    body: "Our team is available 24/7 to provide top-notch support and assistance",
  },
  {
    icon: <LocalShippingIcon color="secondary" sx={{ fontSize: 60 }} />,
    header: "Fast and Secure Delivery",
    body: "Enjoy swift and secure delivery services, ensuring your watch arrives promptly and safely.",
  },
  {
    icon: <StoreIcon color="secondary" sx={{ fontSize: 60 }} />,
    header: "Shopping Experience",
    body: "Browse and purchase easily through our online platforms or visit one of our 4 offline stores",
  },
];

export default function WhyBanner() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        px: { xs: 2, sm: 4, md: 8 }, // responsive padding
        py: { xs: 4, sm: 5, md: 6 },
        gap: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem" },
          }}
        >
          Why Choose Us
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            maxWidth: 700,
            mx: "auto",
          }}
        >
          We stand out for our commitment to excellence and customer
          satisfaction. Here’s why you should choose us
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
            size={{ xs: 12, sm: 6, md: 3 }} // 📱 1 col, 🧾 2 col, 💻 4 col
            display="flex"
            justifyContent="center"
          >
            <IconTextCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
