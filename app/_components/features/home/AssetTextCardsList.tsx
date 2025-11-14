// src/components/organisms/AssetTextCardsList.tsx

import { Box } from "@mui/material";
import AssetTextCard from "../../UI/AssetTextCard";

export default function AssetTextCardsList() {
  return (
    <Box
      sx={{
        display: "flex",
        mt: 8,
        mx: 8,
        gap: 2,

        // responsive layout
        flexDirection: {
          xs: "column", // mobile: stack vertically
          sm: "column", // small tablet: still stack
          md: "row", // desktop and up: row
        },
        justifyContent: {
          xs: "center",
          sm: "center",
          md: "space-between",
        },
        alignItems: {
          xs: "center",
          sm: "center",
          md: "stretch",
        },
      }}
    >
      <AssetTextCard image="/authentic.svg" title="Authenticity Guaranteed">
        Verified by Team Experts to Ensure Your Satisfaction
      </AssetTextCard>
      <AssetTextCard image="/delivery.svg" title="Shipping Insurance">
        Your Watch will Arrive Safely at Home with a Complete Protection
      </AssetTextCard>
      <AssetTextCard image="/receipt.svg" title="30 Days Store Warranty">
        We Go Beyond to Secure that You Receive the Best Service Possible
      </AssetTextCard>
    </Box>
  );
}
