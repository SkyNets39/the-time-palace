"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import LoginButton from "../features/authentication/LoginButton";
import { signoutUser } from "@/app/_services/apiAuth/client";
import { useRouter } from "next/navigation";

type MobileMenuProps = {
  links: { label: string; href: string }[];
  isLoggedIn: boolean;
  userName?: string | null;
};

export default function MobileMenu({
  links,
  isLoggedIn,
  userName,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const handleLogoutClick = () => {
    setOpen(false); // tutup drawer
    setOpenLogoutModal(true); // buka modal logout
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await signoutUser();
    setIsLoggingOut(false);
    setOpenLogoutModal(false);
    window.location.href = "/";
  };

  const handleCancelLogout = () => {
    setOpenLogoutModal(false);
  };

  const initial = userName?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      {/* Burger Icon */}
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          display: { xs: "flex", md: "none" },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 270,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header with Close */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Typography fontWeight="bold" fontSize="1.3rem">
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Navigation Links */}
          <List>
            {links.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider />

          {/* Bottom Section */}
          <Box sx={{ p: 2 }}>
            {isLoggedIn ? (
              <>
                {/* Simplified Profile Display */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      color: "white",
                      fontWeight: 600,
                      width: 36,
                      height: 36,
                      fontSize: "1rem",
                    }}
                  >
                    {initial}
                  </Avatar>
                  <Typography variant="body1" fontWeight={500}>
                    {userName}
                  </Typography>
                </Box>

                {/* Account-related actions */}
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        router.push("/account/edit-profile");
                        setOpen(false);
                      }}
                    >
                      <ListItemText primary="Settings" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogoutClick}>
                      <ListItemText
                        primary="Logout"
                        sx={{ color: "error.main", fontWeight: 600 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </>
            ) : (
              <LoginButton />
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={openLogoutModal}
        onClose={isLoggingOut ? undefined : handleCancelLogout}
        PaperProps={{
          sx: {
            borderRadius: 0,
            minWidth: 320,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelLogout}
            disabled={isLoggingOut}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            variant="contained"
            color="error"
            autoFocus
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
