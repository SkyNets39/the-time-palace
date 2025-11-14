import { Box } from "@mui/material";
import HeroSection from "../_components/features/home/HeroSection";
import AssetTextCardsList from "../_components/features/home/AssetTextCardsList";
import BrandsList from "../_components/features/home/BrandsList";

export default async function Page() {
  // const data = await getCurrentSession();
  // console.log(data);
  // const supabase = await createClient();
  // const { data } = await supabase.auth.getSession();
  // console.log("Session:", data.session);
  return (
    <Box sx={{ flex: 1 }}>
      <HeroSection />
      <AssetTextCardsList />
      <BrandsList />
    </Box>
  );
}
