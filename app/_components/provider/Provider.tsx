"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import theme from "@/app/_services/theme";

export default function StyleProvider({ children }: { children: ReactNode }) {
  return (
    // <CacheProvider value={clientSideEmotionCache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    // </CacheProvider>
  );
}
