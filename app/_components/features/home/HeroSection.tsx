"use client";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroSection() {
  return (
    <Box sx={{ maxWidth: "100%", height: 500, mx: 8 }}>
      <Swiper
        modules={[Pagination, Autoplay]}
        style={{ height: "100%" }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {/* Slide 2: Blue background */}
        <SwiperSlide>
          <Box
            sx={{
              backgroundImage: 'url("/banner/banner4.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100%",
            }}
          />
        </SwiperSlide>

        {/* Slide 3: Green background */}
        <SwiperSlide>
          <Box
            sx={{
              backgroundImage: 'url("/banner/banner5.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100%",
            }}
          />
        </SwiperSlide>

        {/* Slide 4: Red background */}
        <SwiperSlide>
          <Box
            sx={{
              backgroundImage: 'url("/banner/banner3.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100%",
            }}
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}
