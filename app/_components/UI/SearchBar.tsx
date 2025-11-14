"use client";

import {
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import SearchIconButton from "./SearchIconButton";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  formatDisplayName,
  normalizeSearchQuery,
} from "@/app/_utils/searchUtils";
import { getSearchSuggestions } from "@/app/_services/apiWatchListings/client";

// Debounce helper biar gak flooding request
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { id: number; name: string }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query);

  // 🔍 Fetch suggestions dynamically with debounce
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const data = await getSearchSuggestions(debouncedQuery);
      setSuggestions(data);
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // 🚀 Handle search submit (both button & Enter)
  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const normalized = normalizeSearchQuery(trimmed);
    startTransition(() => {
      router.push(`/collections/search?q=${normalized}`);
    });

    setSuggestions([]);
    setQuery(""); // optional: clear input
  };

  // 🧠 Handle Enter key in input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // 🎯 Handle suggestion click → navigate langsung ke halaman detail
  const handleSuggestionClick = (id: number) => {
    startTransition(() => {
      router.push(`/collections/${id}`); // ⬅ langsung ke detail page
    });
    setSuggestions([]);
    setQuery("");
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <TextField
          id="navbar-search"
          fullWidth
          placeholder="Search for watches..."
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            "& fieldset": { border: "none" },
            px: 1,
          }}
        />
        <SearchIconButton onClick={handleSearch} />
      </Box>

      {/* 🪄 Search suggestion dropdown */}
      {suggestions.length > 0 && (
        <List
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            mt: 0.5,
            zIndex: 20,
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {suggestions.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleSuggestionClick(item.id)} // ✅ updated
            >
              <ListItemText
                primary={formatDisplayName(item.name)}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "1rem",
                    },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
