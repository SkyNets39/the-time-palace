import { Box, Button, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Button
      component={Link}
      href="/signup"
      variant="text"
      color="secondary"
      sx={{
        px: 3,
        py: 1,
        fontWeight: 600,
        textTransform: "none",
        fontSize: "1rem",
        borderWidth: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PersonIcon fontSize="medium" />
        <Typography variant="body1">Sign in</Typography>
      </Box>
    </Button>
  );
}
