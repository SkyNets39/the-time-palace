"use client";
import { useState, useRef } from "react";
import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signoutUser } from "@/app/_services/apiAuth/client";

type ProfileProps = {
  fullName: string | null;
};

export default function Profile({ fullName }: ProfileProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const initial = fullName?.charAt(0)?.toUpperCase() || "?";
  const open = Boolean(anchorEl);

  // buka menu saat hover
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
    setIsHovering(true);
  };

  // tutup dengan sedikit delay biar smooth
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
      setIsHovering(false);
    }, 120);
  };

  const handleLogoutClick = () => {
    setAnchorEl(null); // tutup menu
    setOpenLogoutModal(true); // buka modal konfirmasi
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await signoutUser();
    setIsLoggingOut(false);
    setOpenLogoutModal(false);

    // Hard refresh ke homepage
    window.location.href = "/";
  };

  const handleCancelLogout = () => {
    setOpenLogoutModal(false);
  };

  return (
    <>
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          px: 1,
          py: 0.5,
          borderRadius: 2,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
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
        <Typography variant="body1">{fullName}</Typography>

        {/* Dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMouseLeave}
          MenuListProps={{
            onMouseEnter: () => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            },
            onMouseLeave: handleMouseLeave,
          }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 180,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              py: 0.5,
            },
          }}
        >
          <MenuItem
            onClick={() => router.push("/account/edit-profile")}
            sx={{
              fontSize: "0.9rem",
              py: 1,
              px: 2,
              "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
            }}
          >
            Settings
          </MenuItem>
          <MenuItem
            onClick={handleLogoutClick}
            sx={{
              fontSize: "0.9rem",
              py: 1,
              px: 2,
              color: "error.main",
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={openLogoutModal}
        onClose={isLoggingOut ? undefined : handleCancelLogout}
        PaperProps={{
          sx: {
            borderRadius: 0,
            minWidth: 400,
            p: 3,
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
