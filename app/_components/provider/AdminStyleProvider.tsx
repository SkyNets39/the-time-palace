"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import adminTheme from "@/app/_services/adminTheme";

export default function StyleProvider({ children }: { children: ReactNode }) {
  return (
    // <CacheProvider value={clientSideEmotionCache}>
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    // </CacheProvider>
  );
}
