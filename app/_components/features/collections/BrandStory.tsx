import { Card, CardContent, Typography, Box } from "@mui/material";
import Image from "next/image";

type BrandStoryProps = {
  brand: string;
};

// ✅ Static data untuk setiap brand
const brandStories: Record<
  string,
  { name: string; image: string; story: string }
> = {
  rolex: {
    name: "Rolex",
    image: "/brands/background/rolex.jpg",
    story:
      "Rolex adalah simbol prestise dan ketepatan Swiss. Didirikan pada tahun 1905, merek ini menjadi pionir dalam sertifikasi kronometer untuk jam tangan dan dikenal karena inovasi seperti jam tangan tahan air Oyster serta mekanisme winding otomatis Perpetual.",
  },
  tudor: {
    name: "Tudor",
    image: "/brands/background/tudor.jpg",
    story:
      "Tudor merupakan saudara dari Rolex yang menawarkan performa tinggi dengan harga lebih terjangkau. Didirikan oleh Hans Wilsdorf pada tahun 1926, Tudor menonjol dengan desain berkarakter dan daya tahan luar biasa, sangat populer di kalangan profesional modern.",
  },
  hublot: {
    name: "Hublot",
    image: "/brands/background/hublot.jpg",
    story:
      "Hublot terkenal dengan filosofi 'Art of Fusion'—menggabungkan material tradisional seperti emas dengan bahan modern seperti karet. Sejak debutnya pada tahun 1980, Hublot dikenal karena desain avant-garde dan energi muda dalam dunia haute horlogerie.",
  },
  "vacheron-constantine": {
    name: "Vacheron Constantine",
    image: "/brands/background/vacheron-constantine.jpg",
    story:
      "Sebagai salah satu produsen jam tertua di dunia (sejak 1755), Vacheron Constantin mewakili puncak keahlian horologi Swiss. Setiap jamnya merupakan karya seni yang menggabungkan tradisi, kerajinan tangan, dan presisi mekanis yang luar biasa.",
  },
  omega: {
    name: "Omega",
    image: "/brands/background/omega.jpg",
    story:
      "Omega adalah pionir dalam eksplorasi dan olahraga. Terkenal karena menjadi jam tangan resmi NASA di bulan dan Olimpiade, Omega mencerminkan semangat inovasi dan ketepatan yang telah bertahan lebih dari satu abad.",
  },
  "patek-philippe": {
    name: "Patek Philippe",
    image: "/brands/background/patek-philippe.jpg",
    story:
      "Patek Philippe merupakan simbol keanggunan dan eksklusivitas tertinggi dalam dunia horologi. Sejak 1839, brand ini dikenal karena pembuatan manual yang rumit, warisan keluarga, dan nilai investasi yang luar biasa pada setiap kreasinya.",
  },
};

export default function BrandStory({ brand }: BrandStoryProps) {
  // Normalisasi nama brand dari params (case-insensitive + spasi ke "-")
  const key = brand.toLowerCase().replace(/\s+/g, "-");
  const data = brandStories[key];

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          py: 6,
          bgcolor: "background.paper",
          borderRadius: 0,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No story available for {brand}.
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 0,
        boxShadow: "none",
        overflow: "hidden",
        outline: "1px solid",
        outlineColor: "divider",
      }}
    >
      {/* ✅ Next.js Image untuk full-cover background */}
      <Box sx={{ position: "relative", width: "100%", height: 320 }}>
        <Image
          src={data.image}
          alt={`${data.name} background`}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          sizes="(max-width: 768px) 100vw, 100vw"
          priority
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            textTransform: "capitalize",
          }}
        >
          {data.name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          {data.story}
        </Typography>
      </CardContent>
    </Card>
  );
}
