import React from 'react';
import { motion } from 'framer-motion';
import video from "../../assets/video/howitworks.mp4";

const Section = () => {
  return (
    <div className="relative w-full h-screen max-h-[800px] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute inset-0 z-10 flex items-center justify-center px-4"
      >
        <div className="bg-black/80 text-white px-10 py-12 rounded-3xl text-center shadow-2xl max-w-3xl w-full flex flex-col items-center space-y-6 border border-white/10 backdrop-blur-md">
          
          {/* "Before" Label */}

          {/* Heading with lines before and after */}
          <div className="flex items-center w-full">
            <div className="flex-grow h-px bg-white/30" />
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-wide mx-4 whitespace-nowrap">
              How It Works
            </h2>
            <div className="flex-grow h-px bg-white/30" />
          </div>

          {/* Description */}
          <div className="flex flex-col items-center space-y-4 mt-2">
            <p className="text-lg sm:text-xl font-medium">
              1. Choose furniture that fits your space and style.
            </p>
            <p className="text-lg sm:text-xl font-medium">
              2. Add it to your kitchen, living room, or workspace with ease.
            </p>
            <p className="text-lg sm:text-xl font-medium">
              3. Enjoy a transformed environment that matches your vision.
            </p>
          </div>

          {/* "After" Label */}
        </div>
      </motion.div>
    </div>
  );
};

export default Section;
