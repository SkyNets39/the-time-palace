"use client";

import { Box, Button, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import WatchOutlinedIcon from "@mui/icons-material/WatchOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: <HomeOutlinedIcon /> },
  {
    label: "Reservations",
    path: "/admin/reservations",
    icon: <EventNoteOutlinedIcon />,
  },
  { label: "Listings", path: "/admin/listings", icon: <WatchOutlinedIcon /> },
  { label: "Orders", path: "/admin/orders", icon: <ListAltOutlinedIcon /> },
  { label: "Stores", path: "/admin/stores", icon: <StoreOutlinedIcon /> },
];

type AdminNavbarProps = {
  currentTab?: string;
};

export default function AdminNavbar({ currentTab }: AdminNavbarProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        mt: 3.5,
        gap: 2,
      }}
    >
      {navItems.map((item) => {
        const isActive = currentTab === item.path;

        return (
          <Button
            key={item.path}
            component={Link}
            variant="text"
            startIcon={item.icon}
            href={item.path}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              px: 1.5,
              py: 0.8,
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              fontWeight: isActive ? 600 : 400,
              textTransform: "none",
              fontSize: "0.8rem",
              backgroundColor: isActive
                ? theme.palette.action.selected
                : "transparent",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              transition: "background-color 0.2s ease",
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}
