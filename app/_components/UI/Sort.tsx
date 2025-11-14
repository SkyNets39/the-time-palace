"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SelectDropdown, { Option } from "./SelectDropdown";
import type { SortOption } from "@/app/_types/sort";

// ✅ Tambahkan opsi sort baru untuk created_date
const sortOptions: Option[] = [
  { value: "newest", label: "Newest to Oldest" },
  { value: "oldest", label: "Oldest to Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha-asc", label: "Alphabet: A → Z" },
  { value: "alpha-desc", label: "Alphabet: Z → A" },
];

export default function Sort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Default sort = newest
  const sortBy = (searchParams.get("sortBy") as SortOption) ?? "newest";

  const handleSortChange = (selected: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", selected);
    params.set("page", "1"); // reset pagination setiap ganti sort

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <SelectDropdown
      options={sortOptions}
      value={sortBy}
      onChange={handleSortChange}
      minWidth={220}
    />
  );
}
