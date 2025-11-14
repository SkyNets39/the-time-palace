import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import StyleProvider from "../_components/provider/Provider";
import AuthCard from "@/app/_components/layout/AuthCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Shell Watches",
  description: "Login or sign up to access your account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#F4F5F7",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppRouterCacheProvider>
          <StyleProvider>
            <AuthCard>{children}</AuthCard>
          </StyleProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
