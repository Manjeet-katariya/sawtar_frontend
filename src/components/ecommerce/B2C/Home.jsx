import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlay, FaTv, FaFilm } from 'react-icons/fa';
import home from '../../../assets/img/ecommerce/ecoAr.png';
import Products from '../Products';
import EcommerceFeatures from '../Ecommercefeatures';
import Singleproduct from '../Singleproduct';
import Category from '../Category';
import Newpage from '../Newpage';
import Newpage1 from '../Newpage1';
import Toast from '../../Toast';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const Ecommerce = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Main Banner */}
      <div className="relative h-[40rem] bg-gradient-to-r from-blue-100 to-pink-100 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-20"></div>
        <div className="relative z-10 h-full py-12 flex items-center">
          <div className="container mx-auto px-6 py-12 flex items-center">
            <div className="w-full md:w-1/2 lg:w-2/5">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                  Transform Your Living Space
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#D26C44] mb-4 sm:mb-6">
                  Premium Interior Design Solutions
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-lg">
                  Discover curated furniture collections that blend style, comfort, and functionality for your dream home.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  onClick={() => navigate('/sawtar/ecommerce/filter')}
                  className="bg-[#D26C44] hover:bg-[#c05a34] text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition duration-300 text-base sm:text-lg"
                >
                  Explore Collections
                </button>
                {/* <button
                  onClick={() => navigate('/sawtar/ecommerce/consultation')}
                  className="border-2 border-[#D26C44] text-[#D26C44] hover:bg-[#D26C44] hover:text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition duration-300 text-base sm:text-lg"
                >
                  Book Consultation
                </button> */}
                <button
                  onClick={() => navigate('/sawtar/ecommerce/seller')}
                  className="border-2 border-[#D26C44] text-[#D26C44] hover:bg-[#D26C44] hover:text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition duration-300 text-base sm:text-lg"
                >
Register as a vendor                </button>


              </motion.div>
            </div>
            <motion.div
              className="hidden md:block absolute right-0 bottom-0 w-1/2 lg:w-1/2 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <img
                src={home}
                alt="Modern interior design with elegant furniture"
                className="absolute right-0 bottom-0 h-[90%] object-contain object-right-bottom"
              />
            </motion.div>
          </div>
        </div>
      </div>
      <Category/>
<Products/>

     

<section className="py-20 mb-2 max-w-7xl mx-auto bg-gradient-to-r from-[#6C4DF6] to-[#D26C44]">
  <div className="px-4 sm:px-6 lg:px-8 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Discover Stylish Interiors at Exclusive Prices
      </h2>
      <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
        Explore our curated collection of modern furniture, decor, and home accessories designed to elevate your space.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-[#D26C44] font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Shop Collection
          </motion.button>
        </Link>
        <Link to="/deals">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#241935] text-white font-medium rounded-lg hover:bg-[#1a103d] transition-colors"
          >
            View Offers
          </motion.button>
        </Link>
      </div>
    </motion.div>
  </div>
</section>


    </div>
  );
};

export default Ecommerce;
