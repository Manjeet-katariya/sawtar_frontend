import React, { useState } from 'react';
import InteriorDesigners from './InteriorDesigners';
import Architects from './Architects';
import ThreeDDevelopers from './ThreeDDevelopers';
import { motion } from 'framer-motion';
import SecureOptionsSection from '../services/SecureOptionsSection';

const Designers = () => {
  const [activeCategory, setActiveCategory] = useState('interior');

  const categories = [
    { id: 'interior', name: 'Interior Designers' },
    { id: 'architect', name: 'Architects' },
    { id: 'developer', name: '3D Developers' }
  ];

  // Animation variants
  const bannerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(214, 122, 86, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <>
    
    
    
    
    
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#2c3e50] to-[#4a6491] text-white overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-[url('/designers-banner.jpg')] bg-cover bg-center opacity-30"></div>
        
        {/* Animated content */}
        <motion.div 
          className="relative container mx-auto px-4 py-16 md:py-24"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Find the Perfect Professional for Your Project
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Connect with top-rated interior designers, architects, and 3D visualization experts to bring your vision to life.
            </p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-3 rounded-full font-semibold text-white"
              style={{ backgroundColor: '#D67A56' }}
            >
Explore            </motion.button>
          </div>
        </motion.div>
        
        {/* Animated decorative elements */}
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 bg-[#D67A56] rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Category Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 border-b border-gray-200">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                  activeCategory === category.id
                    ? 'text-[#D67A56]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.name}
                {activeCategory === category.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#D67A56]"
                    layoutId="underline"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-12">
        {activeCategory === 'interior' && <InteriorDesigners />}
        {activeCategory === 'architect' && <Architects />}
        {activeCategory === 'developer' && <ThreeDDevelopers />}
      </div>
    </div>
    <SecureOptionsSection/>
</>
  
  );
};

export default Designers;