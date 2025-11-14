"use client";

import { Box, Button, useTheme } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import Logo from "../../UI/Logo";
import LogoutIcon from "@mui/icons-material/Logout";
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
          px: 6,
          pt: 6,
          boxSizing: "border-box",
        }}
      >
        <Box>
          <Logo admin />
          {/* Kirim currentTab agar navbar tahu route mana yang aktif */}
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
            gap: 3,
            alignItems: "center",
            py: 1,
            px: 3,
            boxSizing: "border-box",
          }}
        >
          <AdminProfile />
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            sx={{ px: 3 }}
            onClick={handleSignOut}
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
            p: 6,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
