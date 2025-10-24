import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import categoryData from "./data.json";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const CategorySlider = () => {
  return (
    <div className="space-y-20 px-6 py-12 max-w-9xl mx-auto">

<div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Explore Our Design Categories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover modern and trendy designs in various categories to transform your space.
        </p>
      </div>

      {categoryData.map((cat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
        >
          {/* Category Header */}
          <div className="flex justify-between items-center mt-4">
            <h5 className="text-xl text-gray-800">{cat.name}</h5>
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              See more <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Swiper Slider with Custom Navigation */}
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1.4}
              breakpoints={{
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              navigation={{
                prevEl: `.swiper-button-prev-${index}`,
                nextEl: `.swiper-button-next-${index}`,
              }}
              className="py-4 px-10"
            >
              {cat.items.map((item, i) => (
                <SwiperSlide key={i}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-white rounded-2xl overflow-hidden transition-transform duration-300"
                  >
                    <div className="relative group w-full h-48">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Bottom-left hover text */}
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
                        <h3 className="text-white text-lg font-extrabold drop-shadow-md">
                          {item.title}
                        </h3>
                        <p className="text-white text-sm font-bold drop-shadow-md">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Arrows */}
            <button
              className={`swiper-button-prev-${index} absolute left-[-10px] top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100`}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              className={`swiper-button-next-${index} absolute right-[-10px] top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100`}
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CategorySlider;
