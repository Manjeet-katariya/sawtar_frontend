import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

const Card = ({ image, hoverImage, text }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      className="relative w-full max-w-sm    overflow-hidden 
       transition-all duration-300 transform hover:-translate-y-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Heart Icon */}
      <button 
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition duration-200"
        onClick={() => setIsLiked(!isLiked)}
      >
        <HeartIcon 
          className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} 
        />
      </button>

      {/* Image with hover effect */}
      <div className="relative w-full h-70 overflow-hidden">
        <img
          src={isHovered && hoverImage ? hoverImage : image}
          alt={text}
          className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
      </div>

      {/* Text Content */}
      <div className="">
        <span className="  text-gray-800">{text}</span >
      </div>
    </div>
  );
};

export default Card;