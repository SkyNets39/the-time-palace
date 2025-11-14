import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

type AuthCardLayoutProps = {
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  overlayOpacity?: number;
};

export default function AuthCard({
  children,
  imageSrc = "/background/signup.jpg",
  imageAlt = "Luxury watch background",
  overlayOpacity = 0.5,
}: AuthCardLayoutProps) {
  return (
    <Card
      sx={{
        width: { xs: "90%", md: "70%", lg: "60%" },
        height: { xs: "auto", md: "75vh" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
        borderRadius: 0,
        boxShadow: "none",
        backgroundColor: "background.paper",
      }}
    >
      {/* LEFT SECTION — Children (Form) */}
      <CardContent
        sx={{
          flex: 1,
          p: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {children}
      </CardContent>

      {/* RIGHT SECTION — Image */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: { xs: "none", md: "block" },
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          style={{
            objectFit: "cover",
          }}
          priority
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `rgba(0, 0, 0, ${overlayOpacity})`,
          }}
        />
      </Box>
    </Card>
  );
}
