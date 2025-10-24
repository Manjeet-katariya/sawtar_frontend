import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBriefcase, FaProjectDiagram } from 'react-icons/fa';

const DesignerCard = ({ designer, index }) => {
  const handleHireClick = () => {
    console.log(`Hiring ${designer.name}`);
    // You would typically have some hiring logic here
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Header with animated background */}
      <div className="relative h-32 bg-gradient-to-r from-[#FF9A8B] to-[#FF6B95] overflow-hidden">
        {/* Animated decorative elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%)',
              'radial-gradient(circle at 90% 30%, rgba(255,255,255,0.1) 0%, transparent 20%)',
              'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.1) 0%, transparent 20%)',
              'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%)',
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Profile image container */}
        <motion.div 
          className="absolute top-5 left-1/2 transform -translate-x-1/2"
          variants={imageVariants}
          whileHover="hover"
        >
          <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {designer.image ? (
              <img 
                src={designer.image} 
                alt={designer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="w-8 h-8 text-gray-500" />
            )}
            {/* Online status indicator */}
            {designer.online && (
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Card content */}
      <div className="p-6 pt-16 text-center">
        {/* Name and specialty */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-800">{designer.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{designer.specialty}</p>
          
          {/* Rating with star animation */}
          <motion.div 
            className="flex items-center justify-center mt-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center bg-[#D67A56]/10 text-[#D67A56] px-3 py-1 rounded-full">
              <span className="font-bold mr-1">{designer.rating}</span>
              <motion.svg 
                className="w-4 h-4 fill-current" 
                viewBox="0 0 20 20"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Experience and Projects */}
        <motion.div 
          className="flex justify-between text-sm text-gray-600 mb-4 px-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <FaBriefcase className="mr-1 text-[#D67A56]" />
              <span className="font-semibold text-gray-700">{designer.experience}</span>
            </div>
            <span className="text-xs mt-1">Years</span>
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <FaProjectDiagram className="mr-1 text-[#D67A56]" />
              <span className="font-semibold text-gray-700">{designer.projects}+</span>
            </div>
            <span className="text-xs mt-1">Projects</span>
          </div>
        </motion.div>
        
        {/* Skills chips */}
        {designer.skills && (
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {designer.skills.slice(0, 3).map((skill, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </motion.div>
        )}
        
        {/* Hire Button */}
        <motion.button
          onClick={handleHireClick}
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 4px 8px rgba(214, 122, 86, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#D67A56] to-[#E29578] hover:from-[#c56e4a] hover:to-[#d18463] text-white py-2 rounded-lg font-medium relative overflow-hidden"
        >
          <span className="relative z-10">Hire Now</span>
          {/* Button shine effect */}
          <motion.span
            className="absolute top-0 left-0 h-full w-1/2 bg-white opacity-20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DesignerCard;