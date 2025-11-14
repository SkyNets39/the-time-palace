import { Box, Card, CardContent, Typography } from "@mui/material";
import Button from "@/app/_components/UI/Button";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          backgroundColor: "background.paper",
          textAlign: "center",
          p: { xs: 3, md: 5 },
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
          >
            Thank You!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.7 }}
          >
            Your reservation has been submitted successfully. We’ll contact you
            soon to confirm the details.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.7 }}
          >
            Lets check out our other collections!
          </Typography>

          <Link href="/collections" passHref>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                px: 4,
                py: 1.5,
                textTransform: "none",
              }}
            >
              Browse Our Collections
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}
