// src/components/atoms/SearchInput.tsx

import { InputBase } from "@mui/material";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchInput({
  placeholder,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <InputBase
      placeholder={placeholder ?? "Search watches..."}
      value={value}
      onChange={onChange}
      sx={{
        flex: 1,
        px: 2,
        py: 1,
        borderRadius: 2,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: "grey.100",
      }}
    />
  );
}
