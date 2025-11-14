// src/components/molecules/FilterAccordion.tsx
"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
};

export default function FilterAccordion({
  title,
  children,
  defaultExpanded = false,
}: Props) {
  return (
    <Accordion
      disableGutters
      defaultExpanded={defaultExpanded}
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:before": { display: "none" }, // remove default MUI divider line
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 0,
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 0, py: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
