// src/components/molecules/AssetTextCard.tsx

import { Card, CardContent, CardMedia, Typography } from "@mui/material";

type Props = {
  image: string; // asset URL (e.g., from /public or remote)
  title: string;
  children: string;
};

export default function AssetTextCard({ image, title, children }: Props) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "white",
        overflow: "hidden",
        height: 250, // adjust as needed
        flex: 1,
        borderRadius: 0,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      {/* Left: Image */}
      <CardMedia
        component="img"
        image={image}
        alt="asset"
        sx={{ width: 180, height: "100%", objectFit: "cover", p: 5 }}
      />

      {/* Right: Text */}
      <CardContent
        sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 3 }}
      >
        <Typography variant="h2">{title}</Typography>
        <Typography variant="body1">{children}</Typography>
      </CardContent>
    </Card>
  );
}
