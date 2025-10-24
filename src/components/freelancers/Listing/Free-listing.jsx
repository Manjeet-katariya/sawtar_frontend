import React, { useState } from 'react';
import { FiArrowRight, FiCheck, FiStar, FiUsers, FiSmile, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import BusinessListingPage from './BusinessListingPage';
import { useNavigate } from 'react-router-dom';

const Freelisting = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const handleStart = (e) => {
      navigate('/sawtar/freelancer/create-business');
  
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Verification code sent to +91 ${phoneNumber}`);
      setPhoneNumber('');
    }, 1500);
  };

  // Color definitions
  const primaryColor = '#D26C44';
  const primaryLight = 'rgba(210, 108, 68, 0.1)';
  const primaryDark = '#B85C38';
  const accentColor = '#4A6FA5';
  const accentLight = 'rgba(74, 111, 165, 0.1)';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const cardVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      transition: { duration: 0.3 }
    }
  };

  const phoneVariants = {
    initial: { y: 50, opacity: 0, rotate: 5 },
    animate: { y: 0, opacity: 1, rotate: 0 },
    hover: { y: -10, rotate: -2 }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"
                variants={itemVariants}
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, #E88D67)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Grow Your Business Online
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-xl"
                variants={itemVariants}
              >
                Join thousands of businesses thriving with our free listing platform
              </motion.p>
              
              {/* Search Bar */}
              <motion.div 
                className="mb-8"
                variants={itemVariants}
              >
                <div className="relative max-w-xl">
                  <input
                    type="text"
                    placeholder="Search for businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-white focus:ring-opacity-20 bg-gray-800 bg-opacity-50 backdrop-blur-sm text-white placeholder-gray-300"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl opacity-30 blur-xl"></div>
                <img 
                  src="https://storage.googleapis.com/a1aa/image/d754c884-7515-4a1c-bb62-975fa49b105e.jpg" 
                  alt="Business dashboard" 
                  className="relative rounded-2xl shadow-2xl border-8 border-white"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Form Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                List Your Business <span style={{ color: primaryColor }}>for Free</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get discovered by millions of potential customers in just a few minutes
              </p>
            </motion.div>

            <motion.form 
              variants={itemVariants}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img
                      src="https://flagcdn.com/w20/in.png"
                      alt="Indian flag"
                      className="h-5 w-5"
                    />
                    <span className="ml-2 text-gray-700 font-medium">+91</span>
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    required
                    className="w-full pl-16 pr-4 py-3.5 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-opacity-50 text-lg placeholder-gray-400 transition-all duration-300"
                    style={{ 
                      borderColor: primaryLight,
                      focusRingColor: primaryColor
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
  onClick={handleStart} // ✅ cleaner
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-6 py-3.5 rounded-xl text-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                    isSubmitting || phoneNumber.length !== 10 ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryDark})`,
                    boxShadow: `0 4px 15px ${primaryColor}40`
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Get Started <FiArrowRight className="ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>

            <motion.div 
              variants={itemVariants}
              className="mt-10 space-y-4"
            >
              {[
                { icon: FiCheck, text: 'Reach millions of potential customers instantly', bold: 'Massive Exposure' },
                { icon: FiUsers, text: 'Build trust with reviews and direct communication', bold: 'Engage Customers' },
                { icon: FiStar, text: 'Showcase your unique products and services', bold: 'Stand Out' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4"
                  style={{ borderLeftColor: primaryColor }}
                >
                  <div className="p-2 rounded-full mr-4" style={{ backgroundColor: primaryLight }}>
                    <item.icon className="h-5 w-5" style={{ color: primaryColor }} />
                  </div>
                  <p className="text-gray-700">
                    <span className="font-bold text-gray-900">{item.bold}</span> - {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative max-w-md mx-auto">
              {/* Phone Mockup */}
              <motion.div
                variants={phoneVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="relative z-10"
              >
                <div className="absolute -inset-4 rounded-3xl opacity-30 blur-xl" style={{ backgroundColor: primaryColor }}></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900">
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gray-900 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                    <div className="w-20 h-3 rounded-full bg-gray-600"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600 ml-auto mr-2"></div>
                  </div>
                  <img
                    src="https://storage.googleapis.com/a1aa/image/d754c884-7515-4a1c-bb62-975fa49b105e.jpg"
                    alt="Business listing on mobile app"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>

              {/* Floating Business Card */}
              <motion.div
                className="absolute -top-12 right-0 md:right-8 z-20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-white rounded-xl shadow-xl p-4 w-64 border border-gray-100" style={{ borderTop: `3px solid ${primaryColor}` }}>
                  <div className="flex items-start">
                    <div className="relative">
                      <img
                        src="https://storage.googleapis.com/a1aa/image/ec24679d-fe8b-4d4f-bab7-681bd21824be.jpg"
                        alt="Business"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 text-white p-1 rounded-full" style={{ backgroundColor: primaryColor }}>
                        <FiStar className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-bold text-gray-900 truncate">Your Business</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar 
                              key={star}
                              className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 text-xs ml-1">(1.2k)</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: '90%', backgroundColor: primaryColor }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Profile Strength</span>
                        <span className="font-bold">90%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-5 -left-6 font-bold italic text-sm flex items-center" style={{ color: primaryColor }}>
                  <svg
                    className="mr-1"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 7C6 4 9 7 12 4M9 16C12 13 15 16 18 13"
                      stroke={primaryColor}
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 13L15 16M9 16L6 13"
                      stroke={primaryColor}
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Your Future Listing
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="absolute -bottom-12 left-0 right-0 flex flex-col items-center space-y-4 z-20">
                {[
                  { icon: FiUsers, value: '20 Crore+', text: 'Active Buyers', color: primaryColor },
                  { icon: FiSmile, value: '7 Lakh+', text: 'Happy Business Owners', color: accentColor },
                  { icon: FiShoppingBag, value: '5 Crore+', text: 'Businesses Listed', color: '#4CAF50' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-4 w-72 flex items-center space-x-4 border border-gray-100"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    style={{ borderBottom: `3px solid ${stat.color}` }}
                  >
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
    

    
    </div>
    <BusinessListingPage/>

    </>
  );
};

export default Freelisting;