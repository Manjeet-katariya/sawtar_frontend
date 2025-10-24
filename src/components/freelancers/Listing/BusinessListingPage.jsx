import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiChevronRight, FiStar } from 'react-icons/fi';

const BusinessListingPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Color definitions
  const primaryColor = '#D26C44';
  const primaryLight = 'rgba(210, 108, 68, 0.1)';
  const primaryDark = '#B85C38';

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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const stepCard = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -5,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-20 pb-32">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{
              background: `linear-gradient(135deg, ${primaryColor}, #E88D67)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Elevate Your Business Online
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Claim your free listing and connect with millions of customers
            </p>
          </motion.header>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        {/* Steps Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={container}
          className="mb-20 bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Step 1 */}
            <motion.div 
              className="flex-1 flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-lg transition-all"
              variants={stepCard}
              whileHover="hover"
              style={{ backgroundColor: primaryLight }}
            >
              <div className="relative mb-6 w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryLight }}>
                <span className="text-3xl font-bold" style={{ color: primaryColor }}>1</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Create Account</h3>
              <p className="text-gray-600 mb-4">
                Enter your mobile number to get started
              </p>
              <div className="w-16 h-1 rounded-full" style={{ 
                background: `linear-gradient(90deg, ${primaryColor}, ${primaryDark})`
              }}></div>
            </motion.div>

            {/* Arrow */}
            <motion.div 
              className="hidden lg:flex items-center justify-center"
              variants={item}
              animate={{ 
                x: [0, 8, 0],
                transition: { 
                  repeat: Infinity, 
                  duration: 2 
                } 
              }}
            >
              <FiChevronRight className="w-10 h-10 text-gray-400" />
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="flex-1 flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-lg transition-all"
              variants={stepCard}
              whileHover="hover"
              style={{ backgroundColor: '#EFF6FF' }}
            >
              <div className="relative mb-6 w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                <span className="text-3xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Enter Details</h3>
              <p className="text-gray-600 mb-4">
                Add your business information and photos
              </p>
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            </motion.div>

            {/* Arrow */}
            <motion.div 
              className="hidden lg:flex items-center justify-center"
              variants={item}
              animate={{ 
                x: [0, 8, 0],
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  delay: 0.3
                } 
              }}
            >
              <FiChevronRight className="w-10 h-10 text-gray-400" />
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="flex-1 flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-lg transition-all"
              variants={stepCard}
              whileHover="hover"
              style={{ backgroundColor: '#ECFDF5' }}
            >
              <div className="relative mb-6 w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Go Live</h3>
              <p className="text-gray-600 mb-4">
                Publish and start connecting with customers
              </p>
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-green-400 to-teal-400"></div>
            </motion.div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 md:h-auto">
                <img 
                  src="https://storage.googleapis.com/a1aa/image/57cdf02c-33b1-4c6a-5057-d405ab56b352.jpg"
                  alt="Business listing example"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ 
                  background: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(${primaryColor.replace('#', '').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')}, 0.3))`
                }}></div>
                <div className="relative h-full flex items-end p-8">
                  <h3 className="text-2xl font-bold text-white">
                    Your Business, <span style={{ color: primaryColor }}>Amplified</span>
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10">
                <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
                  WHY LIST WITH US?
                </h3>
                
                <motion.ul 
                  className="space-y-4 mb-8"
                  variants={container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    "Get discovered by millions of potential customers",
                    "Build credibility with verified reviews",
                    "Showcase your products and services",
                    "Manage your online reputation",
                    "Get valuable customer insights"
                  ].map((text, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start gap-3"
                      variants={item}
                    >
                      <div className="p-1 rounded-full mt-0.5" style={{ backgroundColor: primaryLight }}>
                        <FiCheck style={{ color: primaryColor }} />
                      </div>
                      <span className="text-gray-700">{text}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div 
                  className="p-6 rounded-xl" 
                  style={{ backgroundColor: primaryLight }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-bold text-gray-800 mb-3">Ready to get started?</h4>
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex border border-gray-300 rounded-lg overflow-hidden">
                      <div className="flex items-center px-3 bg-white">
                        <img 
                          src="https://flagcdn.com/w20/in.png" 
                          alt="Indian flag" 
                          className="w-5 h-5 mr-2"
                        />
                        <span className="text-sm font-medium">+91</span>
                      </div>
                      <input 
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter mobile number"
                        required
                        className="flex-1 px-3 py-3 outline-none text-sm"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || phoneNumber.length !== 10}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-white font-medium rounded-lg px-6 py-3 flex items-center justify-center gap-2 ${
                        isSubmitting || phoneNumber.length !== 10 ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      style={{ 
                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryDark})`
                      }}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Claim Your Listing <FiArrowRight />
                        </>
                      )}
                    </motion.button>
                  </form>
                  <p className="text-xs text-gray-500 mt-3">
                    By continuing, you agree to our Terms, Privacy Policy and Content Policy
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
    <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { number: "20M+", label: "Active Customers", color: primaryColor },
              { number: "500K+", label: "Businesses Growing", color: "#3B82F6" },
              { number: "4.8★", label: "Average Rating", color: "#10B981" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow bg-white"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-17 h-17 rounded-full flex items-center justify-center mb-4" style={{ 
                  backgroundColor: `${stat.color}20`,
                  color: stat.color
                }}>
                  <span className="text-xl font-bold">{stat.number}</span>
                </div>
                <h4 className="font-bold text-gray-800">{stat.label}</h4>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* Testimonials Section */}
        <section className="bg-gray-50 py-16 rounded-2xl mb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by <span style={{ color: primaryColor }}>Thousands</span> of Businesses
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join our growing community of satisfied business owners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Our customer base grew by 40% after listing with this platform!",
                  name: "Rahul Sharma",
                  business: "Spice & Flavors Restaurant",
                  rating: 5
                },
                {
                  quote: "The free listing helped us establish our online presence quickly.",
                  name: "Priya Patel",
                  business: "Urban Beauty Salon",
                  rating: 4
                },
                {
                  quote: "Excellent way to connect with local customers. Highly recommended!",
                  name: "Vikram Singh",
                  business: "TechGadgets Store",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full mr-4" style={{ backgroundColor: primaryLight }}>
                      <span className="flex items-center justify-center h-full text-sm font-bold" style={{ color: primaryColor }}>
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.business}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
    
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: primaryLight }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses already benefiting from our platform
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryDark})`,
              boxShadow: `0 4px 15px ${primaryColor}60`
            }}
          >
            List Your Business for Free Today
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BusinessListingPage;