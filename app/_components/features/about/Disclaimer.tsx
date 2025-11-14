// src/components/organisms/About/Disclaimer.tsx
import { Box, Typography } from "@mui/material";

type Props = {
  backgroundImage: string;
};

export default function Disclaimer({ backgroundImage }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        px: 8,
        py: 25,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url(${backgroundImage})`,
        backgroundSize: "cover", // ✅ makes image fill without distortion
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center", // ✅ keeps subject centered
      }}
    >
      <Typography variant="h3" gutterBottom>
        Disclaimer
      </Typography>
      <Typography variant="body1" maxWidth="800px">
        All the timepieces listed on Time Palace are sourced from trusted
        dealers. Prices, availability, and specifications are subject to change
        without notice. Time Palace is not affiliated with any watch brands
        mentioned.
      </Typography>
    </Box>
  );
}
