// src/components/atoms/SelectDropdown.tsx
"use client";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

export type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  minWidth?: number;
};

export default function SelectDropdown({ options, value, onChange }: Props) {
  const [selected, setSelected] = useState(value ?? options[0]?.value ?? "");

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setSelected(newValue);
    onChange?.(newValue);
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: { xs: 140, md: 200 }, // ✅ Responsive min-width
        alignSelf: "start",
      }}
    >
      <Select
        value={selected}
        onChange={handleChange}
        variant="standard"
        disableUnderline
        displayEmpty
        sx={{
          // ✅ Responsive font size untuk selected value
          fontSize: { xs: "0.875rem", md: "1rem" }, // 14px mobile, 16px desktop

          "& .MuiSelect-select": {
            padding: 0,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputBase-root:before": {
            borderBottom: "none",
          },
          "& .MuiInputBase-root:after": {
            borderBottom: "none",
          },

          // ✅ Responsive icon size
          "& .MuiSelect-icon": {
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "#fff",
              color: "text.primary",
              borderRadius: 1,
              boxShadow: 3,

              // ✅ Responsive menu items font size
              "& .MuiMenuItem-root": {
                fontSize: { xs: "0.875rem", md: "1rem" }, // 14px mobile, 16px desktop
                minHeight: { xs: 36, md: 48 }, // ✅ Compact height di mobile
                py: { xs: 1, md: 1.5 }, // ✅ Padding lebih kecil di mobile
              },
            },
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
