import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiChevronRight, FiX, FiMenu } from 'react-icons/fi';
import { FaStar, FaRegHeart, FaHeart } from 'react-icons/fa';

const Mainfreelancers = () => {
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const categories = [
    { id: 1, name: "Restaurants", icon: "https://storage.googleapis.com/a1aa/image/64b7aa7d-2d0e-4ea6-d387-74925c0e34d7.jpg", alt: "Restaurants", color: "bg-orange-100" },
    { id: 2, name: "Hotels", icon: "https://storage.googleapis.com/a1aa/image/733a1ec6-d3dc-4e33-616e-4efe5f971003.jpg", alt: "Hotels", color: "bg-blue-100" },
    { id: 3, name: "Beauty Spa", icon: "https://storage.googleapis.com/a1aa/image/6baecaeb-dd0b-47fc-aa45-704801a5599d.jpg", alt: "Beauty Spa", color: "bg-pink-100" },
    { id: 4, name: "Home Decor", icon: "https://storage.googleapis.com/a1aa/image/e774679e-c1d8-429d-c134-17e5f38b266b.jpg", alt: "Home Decor", color: "bg-green-100" },
    { id: 5, name: "Wedding Planning", icon: "https://storage.googleapis.com/a1aa/image/d6ba13ad-1cef-488f-419d-775b7b3f2720.jpg", alt: "Wedding Planning", color: "bg-purple-100", isFeatured: true },
    { id: 6, name: "Education", icon: "https://storage.googleapis.com/a1aa/image/0676e0de-f029-4d6d-2220-121aa0496a24.jpg", alt: "Education", color: "bg-yellow-100" },
    { id: 7, name: "Rent & Hire", icon: "https://storage.googleapis.com/a1aa/image/866a8bb7-6667-46d7-cb88-cc343360be37.jpg", alt: "Rent & Hire", color: "bg-indigo-100" },
    { id: 8, name: "Hospitals", icon: "https://storage.googleapis.com/a1aa/image/9f8e3385-b0af-4aed-1a66-f2578b1e0e8e.jpg", alt: "Hospitals", color: "bg-red-100" },
    { id: 9, name: "Contractors", icon: "https://storage.googleapis.com/a1aa/image/be1bd579-86c8-4d19-7c00-59b328ce670f.jpg", alt: "Contractors", color: "bg-gray-100" },
    { id: 10, name: "Pet Shops", icon: "https://storage.googleapis.com/a1aa/image/99d7019c-e74a-4b6d-5ca0-18a0c68d8a80.jpg", alt: "Pet Shops", color: "bg-teal-100" },
    { id: 11, name: "PG/Hostels", icon: "https://storage.googleapis.com/a1aa/image/8623a84f-d597-4a3e-343b-503540893f8f.jpg", alt: "PG/Hostels", color: "bg-amber-100" },
    { id: 12, name: "Estate Agent", icon: "https://storage.googleapis.com/a1aa/image/9af0cd1f-3b76-49f5-75f6-311f318be8b2.jpg", alt: "Estate Agent", color: "bg-cyan-100" },
    { id: 13, name: "Dentists", icon: "https://storage.googleapis.com/a1aa/image/ed52d4fe-a58e-4155-1012-cbbb0ef439a9.jpg", alt: "Dentists", color: "bg-emerald-100" },
    { id: 14, name: "Gym", icon: "https://storage.googleapis.com/a1aa/image/e2e6dec8-fcfa-48b4-ba75-21df622aea11.jpg", alt: "Gym", color: "bg-violet-100" },
    { id: 15, name: "Loans", icon: "https://storage.googleapis.com/a1aa/image/e7fb889e-9217-467d-42ee-8bbd01f14ca1.jpg", alt: "Loans", color: "bg-fuchsia-100" },
    { id: 16, name: "Event Organisers", icon: "https://storage.googleapis.com/a1aa/image/7deca6ea-754c-45ac-5d73-4e526fd8bde8.jpg", alt: "Event Organisers", color: "bg-rose-100" },
    { id: 17, name: "Driving Schools", icon: "https://storage.googleapis.com/a1aa/image/52c6cdbf-9e61-496f-f794-2dbaabf8727a.jpg", alt: "Driving Schools", color: "bg-sky-100" },
    { id: 18, name: "Packers & Movers", icon: "https://storage.googleapis.com/a1aa/image/e405d327-e24a-47f1-03ca-9967467bc635.jpg", alt: "Packers & Movers", color: "bg-lime-100" },
    { id: 19, name: "Courier Service", icon: "https://storage.googleapis.com/a1aa/image/622920b2-d47c-484d-b369-c13697662e17.jpg", alt: "Courier Service", color: "bg-amber-100" },
    { id: 20, name: "View All", icon: null, alt: null, isIcon: true, color: "bg-gradient-to-r from-blue-500 to-purple-600" }
  ];

  const featuredCategories = [
    { id: 5, name: "Wedding Planning", icon: "https://storage.googleapis.com/a1aa/image/d6ba13ad-1cef-488f-419d-775b7b3f2720.jpg", alt: "Wedding Planning", color: "bg-purple-100" },
    { id: 3, name: "Beauty Spa", icon: "https://storage.googleapis.com/a1aa/image/6baecaeb-dd0b-47fc-aa45-704801a5599d.jpg", alt: "Beauty Spa", color: "bg-pink-100" },
    { id: 1, name: "Restaurants", icon: "https://storage.googleapis.com/a1aa/image/64b7aa7d-2d0e-4ea6-d387-74925c0e34d7.jpg", alt: "Restaurants", color: "bg-orange-100" },
    { id: 6, name: "Education", icon: "https://storage.googleapis.com/a1aa/image/0676e0de-f029-4d6d-2220-121aa0496a24.jpg", alt: "Education", color: "bg-yellow-100" }
  ];

  const weddingRequisites = [
    { name: "Banquet Halls", image: "https://storage.googleapis.com/a1aa/image/7f6b2779-db3f-4f06-36ec-b19d407152fc.jpg", alt: "Banquet halls", rating: 4.8, reviews: 124 },
    { name: "Bridal Requisite", image: "https://storage.googleapis.com/a1aa/image/73bb2211-45c4-4ded-8b01-3b58f37b5e62.jpg", alt: "Bridal requisite", rating: 4.5, reviews: 89 },
    { name: "Caterers", image: "https://storage.googleapis.com/a1aa/image/d895f2de-7cb6-4130-168f-8c083f079033.jpg", alt: "Caterers", rating: 4.7, reviews: 156 }
  ];

  const beautySpa = [
    { name: "Beauty Parlours", image: "https://storage.googleapis.com/a1aa/image/cf69ac2d-309d-4131-053c-da00f5f0f690.jpg", alt: "Beauty parlours", rating: 4.9, reviews: 215 },
    { name: "Spa & Massages", image: "https://storage.googleapis.com/a1aa/image/cb46db1f-1f0a-45a2-f2f8-29e36679dd37.jpg", alt: "Spa & massages", rating: 4.6, reviews: 178 },
    { name: "Salons", image: "https://storage.googleapis.com/a1aa/image/ecd339ce-9500-423f-88bb-df1bb0387e44.jpg", alt: "Salons", rating: 4.7, reviews: 203 }
  ];

  const locations = ["Select Location", "New York", "London", "Tokyo", "Paris", "Sydney", "Dubai", "Singapore"];

  const toggleOffCanvas = () => {
    setIsOffCanvasOpen(!isOffCanvasOpen);
  };

  // Animation variants
  const offCanvasVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
<div className="bg-gradient-to-r from-[#D26C44] to-[#E89B4D] text-white py-16 px-4 sm:px-6 lg:px-8">        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Freelancers Community
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl max-w-3xl mx-auto mb-10 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover the best professionals for your needs
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  className="w-full py-4 pl-12 pr-4 text-gray-800 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative border-t sm:border-t-0 sm:border-l border-gray-200">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full py-4 pl-12 pr-8 text-gray-800 bg-white appearance-none focus:outline-none"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map((location, index) => (
                    <option key={index} value={location} disabled={index === 0}>
                      {location}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <FiChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-medium transition-colors">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Featured Categories */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Top Categories
            </motion.h2>
            <motion.button
              className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
              onClick={toggleOffCanvas}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              View All Categories
              <FiChevronRight className="ml-1" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                variants={categoryVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`${category.color} h-32 flex items-center justify-center p-4`}>
                  <img
                    src={category.icon}
                    alt={category.alt}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-center">{category.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse All Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                  category.isIcon ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-white'
                }`}
                variants={categoryVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={category.isIcon ? toggleOffCanvas : null}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  category.isIcon ? 'bg-white/20' : category.color
                }`}>
                  {category.isIcon ? (
                    <FiMenu className="text-2xl" />
                  ) : (
                    <img
                      src={category.icon}
                      alt={category.alt}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                </div>
                <span className={`text-sm font-medium text-center ${
                  category.isIcon ? 'text-white' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Wedding Requisites */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
<div className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 p-6">              <h3 className="text-2xl font-bold">Wedding Services</h3>
              <p className="opacity-90">Find everything for your perfect wedding</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {weddingRequisites.map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <div className="flex items-center text-yellow-400">
                      <FaStar className="mr-1" />
                      <span className="text-sm">{item.rating}</span>
                      <span className="text-white text-xs ml-2">({item.reviews} reviews)</span>
                    </div>
                  </div>
                  <button 
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    onClick={() => toggleFavorite(`wedding-${index}`)}
                  >
                    {favorites.includes(`wedding-${index}`) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-white" />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Beauty & Spa */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
<div className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 p-6">              <h3 className="text-2xl font-bold">Beauty & Spa</h3>
              <p className="opacity-90">Pamper yourself with the best services</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {beautySpa.map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <div className="flex items-center text-yellow-400">
                      <FaStar className="mr-1" />
                      <span className="text-sm">{item.rating}</span>
                      <span className="text-white text-xs ml-2">({item.reviews} reviews)</span>
                    </div>
                  </div>
                  <button 
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    onClick={() => toggleFavorite(`beauty-${index}`)}
                  >
                    {favorites.includes(`beauty-${index}`) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-white" />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Off-Canvas Menu */}
      <AnimatePresence>
        {isOffCanvasOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleOffCanvas}
            />
            <motion.div
              className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl z-50 overflow-y-auto"
              variants={offCanvasVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
                <button
                  onClick={toggleOffCanvas}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                {categories
                  .filter((category) => !category.isIcon)
                  .map((category, index) => (
                    <motion.div
                      key={category.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${category.color} hover:bg-opacity-80`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                        <img
                          src={category.icon}
                          alt={category.alt}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mainfreelancers;