// src/components/atoms/LinkButton.tsx
import Link from "next/link";
import { Button } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};

export default function LinkButton({ href, children }: Props) {
  return (
    <Button
      LinkComponent={Link}
      href={href}
      disableRipple
      sx={{
        color: "text.primary",
        background: "transparent",
        fontSize: "1.2rem",
        textTransform: "none",
        fontWeight: 500,
        px: 1,
        position: "relative",
        "&:hover": {
          background: "transparent", // no bg hover
        },
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "0%",
          height: "2px",
          bgcolor: "primary.main",
          transition: "width 0.3s ease-in-out",
        },
        "&:hover::after": {
          width: "100%",
        },
      }}
    >
      {children}
    </Button>
  );
}
