// src/components/UI/AssetCard.tsx
import { Card, CardMedia, Box } from "@mui/material";

type Props = {
  image: string;
  alt?: string;
  height?: number | string;
};

export default function AssetCard({
  image,
  alt = "card-image",
  height = 200,
}: Props) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "white",
        overflow: "hidden",
        border: 0.1,
        borderColor: "divider",
        borderRadius: 0,
        boxShadow: "none",
        transition: "transform 0.3s ease",
        m: 0, // ⬅️ pastikan tidak ada margin antar kartu
        "&:hover": {
          transform: { md: "scale(1.02)" },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          width: "100%",
          "&:hover img": {
            transform: "scale(1.1)",
            transition: "ease 0.5s",
          },
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={alt}
          sx={{
            width: "80%",
            height: { xs: 100, sm: 140, md: height },
            objectFit: "contain",
            p: { xs: 2, sm: 4, md: 6 },
          }}
        />
      </Box>
    </Card>
  );
}
