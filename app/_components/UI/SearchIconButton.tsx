// src/components/atoms/SearchIconButton.tsx

import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  onClick?: () => void;
};

export default function SearchIconButton({ onClick }: Props) {
  return (
    <IconButton onClick={onClick} sx={{ color: "primary.main", p: 2 }}>
      <SearchIcon />
    </IconButton>
  );
}
