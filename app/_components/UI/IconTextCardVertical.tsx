// src/components/molecules/IconTextCard.tsx
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode; // Pass an icon component, e.g., <SomeIcon />
  header: string; // Header text
  body: string; // Body text
};

export default function IconTextCard({ icon, header, body }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "flex-start", // aligns icon to the top of text
        flexDirection: "column",
        gap: 2,
        bgcolor: "white",
        border: 2,
        borderColor: "divider",
        p: 5,
      }}
    >
      {/* Left: Icon */}
      <Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>

      {/* Right: Text */}
      <Box>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ fontSize: "1.5rem", fontWeight: "600" }}
        >
          {header}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {body}
        </Typography>
      </Box>
    </Box>
  );
}
