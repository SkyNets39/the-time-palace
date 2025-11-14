import Disclaimer from "@/app/_components/features/about/Disclaimer";
import WhyBanner from "@/app/_components/features/about/WhyBanner";
import ServicesBanner from "@/app/_components/features/about/ServicesBanner";
import ShortIntroduction from "@/app/_components/features/about/ShortIntroduction";

export default function page() {
  return (
    <div>
      <WhyBanner />
      <ServicesBanner />
      <ShortIntroduction />
      <Disclaimer backgroundImage="/background/rolex.jpg" />
    </div>
  );
}
