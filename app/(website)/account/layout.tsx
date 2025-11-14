"use client";

import { Box, Card, Typography, Avatar, Divider } from "@mui/material";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfileName } from "@/app/_services/apiAuth/client";
import { createClient } from "@/app/_services/supabase/client";
import Button from "@/app/_components/UI/Button";

const navItems = [
  { label: "Edit Profile", href: "/account/edit-profile" },
  { label: "Security", href: "/account/security" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [fullName, setFullName] = useState<string>("");

  // 🧠 Ambil user profile dari Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) redirect("/signup");

        if (user?.id) {
          const name = await getProfileName(user.id);
          setFullName(name || "User");
        }
      } catch (err) {
        console.error("Error fetching profile name:", err);
      }
    };

    fetchUserData();
  }, []);

  const initial = fullName?.charAt(0)?.toUpperCase() || "?";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
        py: 5,
        minHeight: "80vh",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1000,
          display: "flex",
          borderRadius: 0,
          boxShadow: "none",
          backgroundColor: "background.paper",
          overflow: "hidden",
        }}
      >
        {/* Sidebar Navigation */}
        <Box
          sx={{
            flex: 1,
            minWidth: 250,
            borderRight: "1px solid",
            borderColor: "divider",
            mt: 3,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Avatar & Name */}
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 90,
              height: 90,
              fontSize: "2rem",
              fontWeight: 600,
            }}
          >
            {initial}
          </Avatar>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              textAlign: "center",
            }}
          >
            {fullName || "Loading..."}
          </Typography>

          <Divider sx={{ width: "100%", my: 2 }} />

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 1,
            }}
          >
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    sx={{
                      width: "100%",
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1.4,
                      border: "1px solid",
                      borderColor: active ? "primary.main" : "divider",
                      backgroundColor: active
                        ? "rgba(44, 62, 80, 0.08)"
                        : "transparent",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: active ? "primary.main" : "text.primary",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Button>
                </Link>
              );
            })}
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 3,
            p: { xs: 3, md: 5 },
            mt: 3,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Card>
    </Box>
  );
}
