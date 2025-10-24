import React from "react";
import { useNavigate } from "react-router-dom";
import slider1 from "../../assets/img/trend/slider1.jpg";
import "./TrendSlider.css"; // CSS for marquee animation

const trends = [
  {
    image: slider1,
    title: "Minimalist Living",
    subtitle: "Simplicity is the new luxury",
  },
  {
    image: slider1,
    title: "Boho Chic",
    subtitle: "Colorful comfort & patterns",
  },
  {
    image: slider1,
    title: "Industrial Loft",
    subtitle: "Raw, rugged aesthetics",
  },
  {
    image: slider1,
    title: "Nature-Inspired",
    subtitle: "Green and earthy tones",
  },
  {
    image: slider1,
    title: "Retro Revival",
    subtitle: "Vintage meets modern",
  },
  {
    image: slider1,
    title: "Japandi Style",
    subtitle: "Japanese + Scandinavian blend",
  },
];

const TrendSlider = () => {
  const navigate = useNavigate();

  const handleSeeNow = () => {
    navigate("/sawtar/project-view");
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-center text-4xl uppercase mb-4 tracking-wide  text-gray-800">
          Trending Design Styles
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover the latest interior design trends to elevate your space with style and sophistication.
        </p>
      </div>

      <div className="marquee-container relative overflow-hidden">
        <div className="marquee flex animate-marquee space-x-6">
          {[...trends, ...trends].map((trend, index) => (
            <div
              key={index}
              className="w-100 bg-white hover:shadow-black transition-all duration-500 group"
            >
            <div className="group relative h-60 overflow-hidden">
  <img
    src={trend.image}
    alt={trend.title}
    className="w-full h-full object-cover"
  />

  {/* Shine effect on hover */}
  <span
    className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20
      group-hover:left-full transition-all duration-700"
  />
</div>

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{trend.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{trend.subtitle}</p>
                <button
                  onClick={handleSeeNow}
                  className="inline-block border border-[#D26C44] text-[#D26C44] hover:bg-[#D26C44] hover:text-white transition-all duration-300 font-semibold px-4 py-2 text-sm"
                >
                  See Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendSlider;
