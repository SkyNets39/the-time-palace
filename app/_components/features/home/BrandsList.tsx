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
    <Box sx={{ my: 5, mx: { xs: 1.5, sm: 3, md: 8 } }}>
      {/* Heading */}
      <Typography
        variant="h2"
        sx={{
          mb: 3,
          textAlign: { xs: "center", sm: "left" },
          fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" },
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
            size={{ xs: 6, sm: 4, md: 2 }}
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
