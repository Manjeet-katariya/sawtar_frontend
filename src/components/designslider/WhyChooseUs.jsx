import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Heart,
  Building2,
  Globe,
  LayoutList,
  Palette,
  Hammer,
  ShieldCheck,
  Star,
  Lightbulb,
  Smile,
  MapPin,
} from "lucide-react";

const whyItems = [
  { icon: ClipboardList, text: "146 quality checks", bg: "from-red-400 to-pink-500" },
  { icon: Heart, text: "1,00,000+ happy homes", bg: "from-pink-500 to-red-400" },
  { icon: Building2, text: "60+ cities", bg: "from-yellow-400 to-orange-500" },
  { icon: Globe, text: "3 countries", bg: "from-blue-400 to-teal-400" },
  { icon: LayoutList, text: "20 lakh+ catalogue products", bg: "from-purple-400 to-indigo-500" },
  { icon: Palette, text: "3,500+ designers", bg: "from-green-400 to-lime-500" },
  { icon: Hammer, text: "On-site supervision", bg: "from-orange-400 to-amber-500" },
  { icon: ShieldCheck, text: "10-year warranty", bg: "from-indigo-500 to-purple-400" },
  { icon: Star, text: "4.9/5 average rating", bg: "from-pink-400 to-rose-400" },
  { icon: Lightbulb, text: "Innovative ideas", bg: "from-lime-400 to-green-500" },
  { icon: Smile, text: "Customer satisfaction", bg: "from-sky-400 to-blue-500" },
  { icon: MapPin, text: "Pan-India service", bg: "from-amber-400 to-orange-400" },
];

const WhyChooseUs = () => {
  return (
    <div className="bg-[#f8f7fc] py-14 overflow-hidden">
      <h2 className="text-center text-4xl uppercase mb-4 tracking-wide pb-10 text-gray-800">
        Why Choose Us
      </h2>
      <div className="relative  max-w-7xl mx-auto overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-6 px-6">
          {[...whyItems, ...whyItems].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.07 }}
                className="flex flex-col items-center justify-center min-w-[200px] bg-white rounded-2xl  px-6 py-6 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${item.bg} flex items-center justify-center clip-custom text-white`}
                >
                  <IconComponent className="w-7 h-7" />
                </div>
                <p className="mt-4 text-sm text-center text-gray-700 font-semibold">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Custom clip-path shapes */}
      <style jsx>{`
        .clip-custom {
          clip-path: polygon(
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%,
            0% 50%
          ); /* hexagon shape */
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WhyChooseUs;
