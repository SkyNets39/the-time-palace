import Link from "next/link";
import { Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type Props = {
  href: string;
  children: React.ReactNode;
  subtitle?: boolean;
  title?: boolean;
  sx?: SxProps<Theme>; // ✅ tambahin biar bisa pakai custom style
};

export default function LinkText({
  href,
  children,
  subtitle,
  title,
  sx,
}: Props) {
  const variant = title ? "h5" : subtitle ? "body2" : "body1";

  return (
    <Typography
      component={Link}
      href={href}
      variant={variant}
      sx={{
        textDecoration: "none",
        color: "inherit",
        textTransform: subtitle ? "uppercase" : "none",
        "&:hover": { color: "primary.main" },
        ...sx, // ✅ merge style overrides
      }}
    >
      {children}
    </Typography>
  );
}
