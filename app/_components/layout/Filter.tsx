"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
} from "@mui/material";
import FilterAccordion from "@/app/_components/UI/FilterAccordion";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { formatDisplayName } from "@/app/_utils/searchUtils";

export type FilterOptions = {
  brands: string[];
  years: number[];
  priceRange: { min: number; max: number };
};

export default function Filter({
  options,
  lockedBrand,
}: {
  options: FilterOptions;
  lockedBrand?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isSearchPage = pathname.includes("/search");
  const keyword = searchParams.get("q") ?? "";

  const initialBrand = lockedBrand ?? searchParams.get("brand") ?? "";
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get("year") ?? ""
  );
  const [price, setPrice] = useState<number[]>([
    Number(searchParams.get("priceMin") ?? options.priceRange.min),
    Number(searchParams.get("priceMax") ?? options.priceRange.max),
  ]);

  useEffect(() => {
    setSelectedYear(searchParams.get("year") ?? "");
    setPrice([
      Number(searchParams.get("priceMin") ?? options.priceRange.min),
      Number(searchParams.get("priceMax") ?? options.priceRange.max),
    ]);
  }, [options.priceRange.max, options.priceRange.min, searchParams]);

  function updateParam(key: string, value: string | number | number[]) {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      params.set("priceMin", String(value[0]));
      params.set("priceMax", String(value[1]));
    } else if (value) {
      if (key === "brand" && lockedBrand) return;
      params.set(key, String(value));
    } else {
      if (key === "price") {
        params.delete("priceMin");
        params.delete("priceMax");
      } else {
        params.delete(key);
      }
    }

    params.set("page", "1");
    if (isSearchPage && keyword) params.set("q", keyword);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: { xs: "none", md: "inherit" } }}>
          <Typography variant="h3" fontWeight={700} mb={0.5}>
            Filter
          </Typography>
          <FilterAltIcon />
        </Box>
      </Box>

      {!lockedBrand && (
        <FilterAccordion title="Brand">
          {options.brands.map((b) => (
            <FormControlLabel
              key={b}
              control={
                <Checkbox
                  checked={selectedBrand === b}
                  onChange={() => {
                    const newVal = selectedBrand === b ? "" : b;
                    setSelectedBrand(newVal);
                    updateParam("brand", newVal);
                  }}
                />
              }
              label={formatDisplayName(b)}
              sx={{ display: "block", ml: 0, textTransform: "capitalize" }}
            />
          ))}
        </FilterAccordion>
      )}

      {options.years.length > 0 && (
        <FilterAccordion title="Year">
          {options.years.map((y) => (
            <FormControlLabel
              key={String(y)}
              control={
                <Checkbox
                  checked={selectedYear === String(y)}
                  onChange={() => {
                    const newVal = selectedYear === String(y) ? "" : String(y);
                    setSelectedYear(newVal);
                    updateParam("year", newVal);
                  }}
                />
              }
              label={y}
              sx={{ display: "block", ml: 0 }}
            />
          ))}
        </FilterAccordion>
      )}

      <FilterAccordion title="Price">
        <Box sx={{ px: 1 }}>
          <Slider
            value={price}
            onChange={(_, val) => setPrice(val as number[])}
            onChangeCommitted={(_, val) =>
              updateParam("price", val as number[])
            }
            valueLabelDisplay="auto"
            min={options.priceRange.min}
            max={options.priceRange.max}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">
              ${price[0].toLocaleString()}
            </Typography>
            <Typography variant="body2">
              ${price[1].toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </FilterAccordion>
    </Box>
  );
}
