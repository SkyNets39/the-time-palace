// src/components/organisms/BrandList.tsx
import { Box, Typography, Grid } from "@mui/material";
import AssetCard from "../../UI/AssetCard";
import Link from "next/link";

type Props = {
  title?: string;
};

export default function BrandsList({ title = "Our Brands" }: Props) {
  const brands = [
    { imgSrc: "/brands/rolexlogo.png", link: "/collections/brand/rolex" },
    { imgSrc: "/brands/hublotlogo.png", link: "/collections/brand/hublot" },
    { imgSrc: "/brands/omegalogo.png", link: "/collections/brand/omega" },
    {
      imgSrc: "/brands/pateklogo.png",
      link: "/collections/brand/patekphilippe",
    },
    { imgSrc: "/brands/tudorlogo.png", link: "/collections/brand/tudor" },
    {
      imgSrc: "/brands/vacheronlogo.png",
      link: "/collections/brand/vacheron-constantine",
    },
  ];

  return (
    <Box sx={{ my: 8, mx: { xs: 2, sm: 4, md: 8 } }}>
      {/* Heading */}
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          textAlign: { xs: "center", sm: "left" },
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem" },
        }}
      >
        {title}
      </Typography>

      {/* Brand Logos */}
      <Grid
        container
        spacing={0} // ⬅️ hilangkan jarak antar kartu
        justifyContent="center"
        alignItems="center"
      >
        {brands.map((brand, index) => (
          <Grid
            key={index}
            size={{ xs: 6, sm: 4, md: 2 }} // 📱 2 kolom, 🧾 3 kolom, 💻 6 kolom
            display="flex"
            justifyContent="center"
          >
            <Link href={brand.link} style={{ width: "100%" }}>
              <AssetCard image={brand.imgSrc} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
