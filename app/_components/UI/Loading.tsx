import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{ margin: "auto" }}>
      <CircularProgress />
    </Box>
  );
}
