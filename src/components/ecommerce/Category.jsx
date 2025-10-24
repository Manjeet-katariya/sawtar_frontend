import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import img1 from "../../assets/img/ecommerce/category/Beds.png";
import img2 from "../../assets/img/ecommerce/category/Bookshelves.png";
import img3 from "../../assets/img/ecommerce/category/Coffee_Tables.png";
import img4 from "../../assets/img/ecommerce/category/Dining.png";
import img5 from "../../assets/img/ecommerce/category/Recliners.png";
import img6 from "../../assets/img/ecommerce/category/Seating.png";
import img7 from "../../assets/img/ecommerce/category/Shoe_Racks.png";
import img8 from "../../assets/img/ecommerce/category/Sofas.png";
import img9 from "../../assets/img/ecommerce/category/Study.png";
import img10 from "../../assets/img/ecommerce/category/Wardrobes.png";
import img11 from "../../assets/img/ecommerce/category/Web_Sofa_Cum_bed.png";

const Category = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "New Arrivals",
      icon: img8,
      bgColor: "#f5f5f5",
      isNew: true,
      label: "New"
    },
    {
      id: 2,
      name: "Sofas",
      icon: img8,
      bgColor: "#f5f5f5"
    },
    {
      id: 3,
      name: "Sofa Cum bed",
      icon: img11,
      bgColor: "#f5f5f5"
    },
    {
      id: 4,
      name: "Beds",
      icon: img1,
      bgColor: "#f5f5f5"
    },
    {
      id: 5,
      name: "Dining",
      icon: img4,
      bgColor: "#f5f5f5"
    },
    {
      id: 6,
      name: "Wardrobes",
      icon: img10,
      bgColor: "#f5f5f5"
    },
    {
      id: 7,
      name: "Shoe Racks",
      icon: img7,
      bgColor: "#f5f5f5"
    },
    {
      id: 8,
      name: "Bookshelves",
      icon: img2,
      bgColor: "#f5f5f5"
    },
    {
      id: 9,
      name: "TV Units",
      icon: img8,
      bgColor: "#f5f5f5"
    },
    {
      id: 10,
      name: "Recliners",
      icon: img5,
      bgColor: "#f5f5f5"
    },
    {
      id: 11,
      name: "Seating",
      icon: img6,
      bgColor: "#f5f5f5"
    },
    {
      id: 12,
      name: "Coffee Tables",
      icon: img3,
      bgColor: "#f5f5f5"
    },
    {
      id: 13,
      name: "Study",
      icon: img9,
      bgColor: "#f5f5f5"
    },
    {
      id: 14,
      name: "Deal Zone",
      icon: "",
      bgColor: "#f5f5f5",
      isDeal: true,
      label: "%"
    },
    {
      id: 15,
      name: "50+ Stores",
      icon: img8,
      bgColor: "#f5f5f5"
    },
    {
      id: 16,
      name: "See More",
      icon: "",
      bgColor: "#f5f5f5",
      isSeeMore: true,
      label: "+"
    }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/sawtar/ecommerce/filter?category=${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 
        className="text-center text-[#1f2a37] text-2xl md:text-3xl font-medium p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Our Furniture Range
      </h2>
      
      <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 max-w-6xl mx-auto">
        {categories.map((category) => (
          <motion.div 
            key={category.id}
            className="flex flex-col items-center space-y-3 cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className={`w-16 h-16 rounded-full flex items-center justify-center bg-[#f5f5f5] hover:bg-gray-200 transition-colors`}
              whileHover={{ scale: 1.1 }}
            >
              {category.icon ? (
                <img 
                  alt={`${category.name} icon`} 
                  className="object-contain" 
                  height={50} 
                  src={category.icon} 
                  width={50} 
                />
              ) : (
                <span className={`text-xl font-semibold ${category.isDeal ? 'text-[#f26a6a]' : category.isSeeMore ? 'text-[#E37B3B]' : 'text-black'}`}>
                  {category.label}
                </span>
              )}
            </motion.div>
            <motion.span 
              className="text-sm text-[#1f2a37] hover:text-[#E37B3B] transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {category.name}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Category;