// src/app/_components/features/collections/CatalogCardList.tsx
import { Grid } from "@mui/material";
import CatalogCard from "./CatalogCard";
import { WatchListing } from "@/app/_types";

type Props = {
  data: WatchListing[];
};

export default function CardCatalogList({ data }: Props) {
  return (
    <Grid container spacing={0} sx={{ mb: 8 }}>
      {data.map((item) => (
        <Grid
          key={item.id}
          size={{ xs: 6, sm: 6, md: 4, lg: 4 }} // 📱 Tablet & HP = 2 kolom, 💻 = 3 kolom
          display="flex"
          justifyContent="center"
        >
          <CatalogCard data={item} />
        </Grid>
      ))}
    </Grid>
  );
}
