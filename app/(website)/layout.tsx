import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import StyleProvider from "../_components/provider/Provider";

import { Box } from "@mui/material";
import Navbar from "../_components/layout/NavBar";
import Footer from "../_components/layout/Footer";

export const metadata: Metadata = {
  title: { template: "%s | Chronox", default: "Welcome to Chronox" },
  description: "Second hand luxury watches marketplace origin from Indonesia ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <StyleProvider>
            <Navbar />
            <Box
              sx={{
                display: "flex",
                bgcolor: "background.default",
                flexDirection: "column",
                minHeight: "100vh",
                pt: { xs: 2, md: 8 },
              }}
            >
              {children}
            </Box>
            <Footer />
          </StyleProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
