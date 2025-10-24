
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDropdown = ({ item, dragItemRef }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDragStart = (e) => {
    dragItemRef.current = item;
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'copy';
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <motion.div
        className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {item.icon}
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-4">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDragStart}
                draggable
                className="w-full px-4 py-2 bg-[#CD673F] text-white rounded-lg hover:bg-[#B35A36] transition"
              >
                Add to Room
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDropdown;
