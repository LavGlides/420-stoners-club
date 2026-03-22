"use client";
import { useEffect, useState } from "react";

type BannerSettings = {
  heading: string;
  subtitle: string;
  image_url: string;
  enabled: boolean;
};

const DEFAULTS: BannerSettings = {
  heading: "Elevated. Always.",
  subtitle: "Premium streetwear for the culture. Limited runs, no restocks.",
  image_url: "", // Empty string for solid background
  enabled: true,
};

export default function HeroSection() {
  const [banner, setBanner] = useState<BannerSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to fallback to defaults if API takes too long
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 second timeout

    fetch("/api/banner")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setBanner(data);
        setLoading(false);
        clearTimeout(timeout);
      })
      .catch((error) => {
        console.warn("Banner API failed, using defaults:", error);
        setBanner(DEFAULTS); // Ensure we use defaults on error
        setLoading(false);
        clearTimeout(timeout);
      });

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <section className="relative w-full h-screen flex items-end pb-16 px-6 overflow-hidden bg-linear-to-b from-[#1C2B1A] via-[#0D1A0C] to-[#0D1A0C]">
        <div className="absolute inset-0 bg-linear-to-b from-[#1C2B1A]/80 via-[#0D1A0C]/40 to-[#0D1A0C]/90" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-[#A8C49A] text-xs tracking-[0.4em] uppercase mb-4">
            New Drop — 2026
          </p>
          <h1
            className="text-white text-5xl md:text-7xl font-black leading-none mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loading...
          </h1>
        </div>
      </section>
    );
  }

  if (!banner.enabled) {
    return null; // Hide banner if disabled
  }

  return (
    <section
      className={`relative w-full h-screen flex items-end pb-16 px-6 overflow-hidden ${
        banner.image_url
          ? ""
          : "bg-linear-to-b from-[#1C2B1A] via-[#0D1A0C] to-[#0D1A0C]"
      }`}
      style={
        banner.image_url
          ? {
              backgroundImage: `url('${banner.image_url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#1C2B1A]/80 via-[#0D1A0C]/40 to-[#0D1A0C]/90" />

      {/* Shop Collection Button - Centered on Mobile, Top Right on Desktop */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 sm:top-48 sm:right-6 sm:left-auto sm:transform-none z-20">
        <button
          onClick={() => {
            const collectionSection = document.getElementById("collection");
            collectionSection?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-white text-sm tracking-[0.25em] uppercase
                     px-6 sm:px-8 py-3 rounded-md hover:bg-[#1C2B1A] hover:text-white
                     transition-all duration-300 font-medium border-2 border-white/60 hover:border-white
                     shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span className="animate-gradient-text bg-linear-to-r from-[#FFD700] via-[#3D6B35] to-[#FFD700] bg-clip-text text-transparent drop-shadow-lg">
            Shop Collection
          </span>
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-end">
        {/* Left side - Text */}
        <div className="max-w-2xl">
          <p className="text-[#A8C49A] text-xs tracking-[0.4em] uppercase mb-4">
            New Drop — 2026
          </p>
          <h1
            className="text-white text-4xl sm:text-5xl md:text-7xl font-black leading-none mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {banner.heading}
          </h1>
          <p className="text-[#C8D8C4] text-xs sm:text-sm max-w-xs leading-relaxed">
            {banner.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
