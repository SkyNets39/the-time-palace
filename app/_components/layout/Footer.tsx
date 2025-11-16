import { getStores } from "@/app/_services/apiStores/server";
import { Box, Typography } from "@mui/material";

export default async function Footer() {
  const stores = await getStores();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: { xs: 2, md: 8 },
        backgroundColor: "grey.900",
        color: "grey.100",
      }}
    >
      {/* Store List */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: 2.5,
          columnGap: 4,
        }}
      >
        {stores.map((store) => (
          <Box
            key={store.id}
            sx={{
              flex: "1 1 200px",
              minWidth: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {store.name}
            </Typography>

            {store.address && (
              <Typography variant="body2" sx={{ mb: 0.3 }}>
                {store.address}
              </Typography>
            )}

            {store.open_days && store.open_hours && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {store.open_days} — {store.open_hours}
              </Typography>
            )}

            {store.phone && (
              <Typography variant="body2">Tel: {store.phone}</Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* Divider line */}
      <Box
        sx={{
          mt: 4,
          borderTop: "1px solid",
          borderColor: "grey.700",
          pt: 2,
        }}
      >
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Time Palace. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
