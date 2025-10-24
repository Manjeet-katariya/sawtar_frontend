import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTools, FaBolt, FaBroom, FaHardHat, FaHammer, FaCar, FaPray, 
  FaTooth, FaLaptop, FaUtensils, FaBalanceScale, FaPrint, FaTruck, 
  FaShieldAlt, FaStar, FaUserTie, FaHome, FaPalette, FaCamera, 
  FaBug, FaGraduationCap, FaChartLine, FaCarAlt, FaCalendarAlt, 
  FaHospital, FaLaptopCode, FaBed, FaPaintRoller, FaClipboardList,
  FaSearch, FaArrowRight, FaPhone
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const CategoryCards = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Plumber', icon: FaTools, featured: true },
    { name: 'Electrician', icon: FaBolt, featured: true },
    { name: 'Maid', icon: FaBroom },
    { name: 'Raj Mistri', icon: FaHardHat, featured: true },
    { name: 'Carpenter', icon: FaHammer, featured: true },
    { name: 'Cleaner', icon: FaBroom },
    { name: 'Driver', icon: FaCar },
    { name: 'Pandit Ji', icon: FaPray, featured: true },
    { name: 'Dentists', icon: FaTooth },
    { name: 'Computer Repair', icon: FaLaptop },
    { name: 'Caterers', icon: FaUtensils, featured: true },
    { name: 'Lawyers', icon: FaBalanceScale },
    { name: 'Printing Services', icon: FaPrint },
    { name: 'Packers & Movers', icon: FaTruck, featured: true },
    { name: 'Security Systems', icon: FaShieldAlt },
    { name: 'Astrologers', icon: FaStar },
    { name: 'Chartered Accountant', icon: FaUserTie },
    { name: 'Real Estate', icon: FaHome, featured: true },
    { name: 'Interior Designers', icon: FaPalette },
    { name: 'Photographers', icon: FaCamera, featured: true },
    { name: 'Pest Control', icon: FaBug },
    { name: 'Vocational Training', icon: FaGraduationCap },
    { name: 'Event Organizers', icon: FaCalendarAlt, featured: true },
    { name: 'Hospitals', icon: FaHospital },
    { name: 'Web Designers', icon: FaLaptopCode },
    { name: 'Nursing Services', icon: FaBed },
    { name: 'Painting Contractors', icon: FaPaintRoller },
    { name: 'Registration Consultants', icon: FaClipboardList },
    { name: 'Car Repair', icon: FaCarAlt, featured: true },
    { name: 'Fabricators', icon: FaTools },
    { name: 'Hobbies', icon: FaStar },
    { name: 'Scrap Dealers', icon: FaTruck }
  ];

  const featuredCategories = categories.filter(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  const handleCategoryClick = (categoryName) => {
    navigate(`/sawtar/freelancer/browse-category?category=${encodeURIComponent(categoryName)}`);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5
      }
    }),
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 } 
    },
  };

  const featuredCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.6
      }
    }),
    hover: { 
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 } 
    },
  };

  return (
    <>
    <div className="bg-gray-50">
      {/* Hero Banner */}
<div className="w-full bg-gradient-to-r from-[#1A132F] to-[#3A1D4D] py-16 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 ">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Find Trusted <span className="text-[#D26C44]">Professionals</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Connect with skilled service providers for all your needs
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mb-8">
                <input
                  type="text"
                  placeholder="What service are you looking for?..."
                  className="w-full py-4 pl-6 pr-16 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#D26C44] hover:bg-yellow-300 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                  <FaSearch />
                  Search
                </button>
              </div>
            </div>
            
           
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Most popular services booked by our customers
            </p>
          </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {regularCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={`regular-${index}`}
                  className="group rounded-xl bg-white p-5 flex flex-col items-center justify-center h-full cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-100"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover="hover"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-indigo-50 transition-colors">
                    <Icon className="text-gray-700 text-xl group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h3 className="text-gray-800 font-medium text-sm text-center">{category.name}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Middle Banner */}
      

 
      <div className="w-full bg-[#1A132F] py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a professional urgently?</h2>
          <p className="text-lg text-blue-200 mb-6 max-w-2xl mx-auto">
            Our verified professionals are available 24/7 for emergency services
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-800 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
              <FaBolt className="text-yellow-500" /> Emergency Services
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white/10 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
              <FaPhone className="transform rotate-90" /> Call Support
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoryCards;