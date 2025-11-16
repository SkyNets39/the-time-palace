"use client";

import { Box, Button, useTheme } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../../UI/Logo";
import AdminNavbar from "@/app/_components/dashboard/UI/AdminNavbar";
import AdminProfile from "./AdminProfile";
import { useRouter } from "next/navigation";
import { signoutUser } from "@/app/_services/apiAuth/client";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signoutUser();
      router.replace("/signup-admin"); // arahkan ke login page (atau "/")
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to sign out. Please try again.");
    }
  };

  /**
   * Tentukan currentTab berdasarkan route aktif
   * (untuk dikirim ke AdminNavbar sebagai prop)
   */
  const currentTab = useMemo(() => {
    if (pathname.startsWith("/admin/reservations"))
      return "/admin/reservations";
    if (pathname.startsWith("/admin/listings")) return "/admin/listings";
    if (pathname.startsWith("/admin/orders")) return "/admin/orders";
    if (pathname.startsWith("/admin/stores")) return "/admin/stores";
    if (pathname.startsWith("/admin/users")) return "/admin/users";
    return "/admin"; // default ke dashboard
  }, [pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Box
        component="aside"
        sx={{
          bgcolor: "background.paper",
          borderRight: `1px solid`,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 5,
          pt: 4,
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Logo admin />
          <AdminNavbar currentTab={currentTab} />
        </Box>
      </Box>

      {/* Main section */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar atas */}
        <Box
          component="header"
          sx={{
            bgcolor: "background.paper",
            justifyContent: "flex-end",
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            gap: 1.8,
            alignItems: "center",
            py: 0.6,
            px: 2,
            boxSizing: "border-box",
          }}
        >
          <AdminProfile />
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            sx={{ px: 3 }}
          >
            Sign out
          </Button>
        </Box>

        {/* Konten utama */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3.5,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
