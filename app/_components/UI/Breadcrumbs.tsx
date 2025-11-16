// src/components/UI/DynamicBreadcrumbs.tsx
"use client";
import { usePathname } from "next/navigation";
import { Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NextLink from "next/link";
import { Box } from "@mui/material";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    if (pathname === "/") return [{ label: "Home", href: "/" }];

    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", href: "/" }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = path
        .replace(/[-_]/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      breadcrumbs.push({
        label: decodeURIComponent(label),
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ py: 1 }}>
      <MUIBreadcrumbs
        separator={
          <NavigateNextIcon
            sx={{
              fontSize: { xs: "0.85rem", md: "1rem" },
            }}
          />
        }
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const commonStyle = {
            fontSize: { xs: "0.85rem", md: "1rem" },
            fontWeight: 600,
            lineHeight: 1.5, // ✅ samain biar tinggi sejajar
            display: "flex",
            alignItems: "center", // ✅ buat jaga posisi vertical
          } as const;

          return isLast ? (
            <Typography key={crumb.href} color="text.primary" sx={commonStyle}>
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={crumb.href}
              component={NextLink}
              href={crumb.href}
              underline="hover"
              color="inherit"
              sx={commonStyle}
            >
              {crumb.label}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
}
