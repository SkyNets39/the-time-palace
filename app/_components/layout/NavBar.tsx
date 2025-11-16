// src/components/organisms/Navbar.tsx

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

import Logo from "../UI/Logo";
import SearchBar from "../UI/SearchBar";
import LinkButton from "../UI/LinkButton";
import LoginButton from "../features/authentication/LoginButton";
import Profile from "../UI/Profile";
import { getServerSession } from "@/app/_services/apiAuth/server";
import MobileMenu from "../UI/MobileMenu";

import { getProfileName } from "@/app/_services/apiProfileClient/server";

const links = [
  { label: "Collections", href: "/collections" },
  { label: "My Reservations", href: "/my-reservations" },
  { label: "About Us", href: "/about" },
];

export default async function Navbar() {
  const user = await getServerSession();
  const userId = user?.id;
  const userName = userId ? await getProfileName(userId) : null;

  const isLoggedIn = !!userId;

  return (
    <nav>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          px: { xs: 1.5, md: 5 },
          py: { xs: 1.1, md: 2.5 },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: 56, md: 64 },
            px: 0,
            position: "relative", // ✅ Untuk absolute positioning logo di mobile
          }}
        >
          {/* 🔹 LEFT — Burger Menu (Mobile) + Navigation Links (Desktop) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0, md: 5 },
              flex: { xs: 0, md: 1 },
              zIndex: 1, // ✅ Pastikan burger di atas logo
            }}
          >
            {/* Burger menu - Mobile only */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <MobileMenu
                links={links}
                isLoggedIn={isLoggedIn}
                userName={userName}
              />
            </Box>

            {/* Navigation links - Desktop only */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 5,
              }}
            >
              {links.map((link) => (
                <LinkButton key={link.href} href={link.href}>
                  {link.label}
                </LinkButton>
              ))}
            </Box>
          </Box>

          {/* 🔹 CENTER — Logo */}
          <Box
            sx={{
              // Mobile: Absolute center
              position: { xs: "absolute", md: "static" },
              left: { xs: "50%", md: "auto" },
              transform: { xs: "translateX(-50%)", md: "none" },

              // Desktop: Normal flow
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Logo />
          </Box>

          {/* 🔹 RIGHT — Search Bar + Profile/Login */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 2,
              flex: { xs: 0, md: 1 },
            }}
          >
            {/* Search bar - Desktop only */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                flex: 1,
                maxWidth: 300,
              }}
            >
              <SearchBar />
            </Box>

            {/* Profile/Login - Desktop only */}
            {isLoggedIn ? (
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Profile fullName={userName} />
              </Box>
            ) : (
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <LoginButton />
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </nav>
  );
}
