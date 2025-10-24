import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Dummy data
const testimonials = [
  {
    quote: "Lorem ipsum dolor sit amet consectetur. Consequat auctor consectetur nunc vitae dolor blandit. Et mi sem malesuada enim neque lorem.",
    name: "Stacey Prosacco",
    title: "Legacy Tactical Representative",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    quote: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    name: "Alex Johnson",
    title: "Marketing Manager",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    name: "Sarah Williams",
    title: "Product Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    name: "Michael Brown",
    title: "CEO, Tech Solutions",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  }
];

export default function TestimonialSlider() {
  return (
    <div className="w-full bg-white py-16 px-4">
      <h2 className="text-center text-4xl uppercase mb-4 tracking-widest pb-10 text-gray-800">What They Say About Us?</h2>
      
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        spaceBetween={30}
        slidesPerView={2}
        centeredSlides={true}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
        }}
        className="max-w-6xl mx-auto "
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div className={`rounded-xl p-6 shadow-lg text-center flex flex-col items-center transition-all duration-300 ${isActive ? 'bg-[#2d6cdf] text-white' : 'bg-gray-100 text-gray-800 blur-sm'}`}>
                <p className={`text-sm ${isActive ? 'opacity-80' : 'opacity-70'} max-w-xl mb-4`}>
                  {item.quote}
                </p>
                <div className="flex mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.184 3.64a1 1 0 00.95.69h3.813c.969 0 1.371 1.24.588 1.81l-3.084 2.24a1 1 0 00-.364 1.118l1.184 3.64c.3.921-.755 1.688-1.538 1.118l-3.084-2.24a1 1 0 00-1.175 0l-3.084 2.24c-.783.57-1.838-.197-1.538-1.118l1.184-3.64a1 1 0 00-.364-1.118l-3.084-2.24c-.783-.57-.38-1.81.588-1.81h3.813a1 1 0 00.95-.69l1.184-3.64z" />
                    </svg>
                  ))}
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-24 h-24 rounded-full border-4 shadow-md object-cover ${isActive ? 'border-white' : 'border-gray-300'}`}
                />
                <h3 className={`mt-4 text-lg font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>{item.name}</h3>
                <p className={`text-sm ${isActive ? 'opacity-80' : 'opacity-70'}`}>{item.title}</p>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}