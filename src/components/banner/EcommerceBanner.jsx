import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { FaExpandArrowsAlt, FaVideo, FaSearchDollar } from "react-icons/fa";
import banner from "../../assets/img/ecommercebanner.png";
import productImage from "../../assets/img/ecommerce/bannerecommerce1.png";

const EcommerceBanner = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const handleExploreClick = () => {
    navigate("/sawtar/ecommerce/");
  };

  const features = [
    {
      id: 1,
      title: "Immersive Preview",
      description: "See products in your space with our technology",
      icon: <FaExpandArrowsAlt className="text-2xl" />,
      color: "bg-blue-100 text-blue-600",
      position: "lg:translate-y-0" // First item normal position
    },
    {
      id: 2,
      title: "Smart Pricing",
      description: "Real-time price tracking across vendors",
      icon: <FaSearchDollar className="text-2xl" />,
      color: "bg-purple-100 text-purple-600",
      position: "lg:translate-y-12" // Second item pushed down
    },
    {
      id: 3,
      title: "Expert Advice",
      description: "Access to design specialists",
      icon: <FaVideo className="text-2xl" />,
      color: "bg-emerald-100 text-emerald-600",
      position: "lg:translate-y-0" // Third item normal position
    }
  ];

  return (
    <div className="w-full relative overflow-hidden">
      {/* Banner Section - 500px height */}
   <section
      ref={containerRef}
      className="relative w-full h-[500px]  overflow-hidden flex items-center"
    >
      {/* Parallax Background with Black Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <motion.div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${banner})`,
          y: yBg,
          opacity: opacityBg
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/30 to-transparent z-0" />

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Text Content (Left Side) */}
          <div className="w-full lg:w-1/2 text-white">
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-clip-text text-transparent  text-white text-[linear-gradient(135deg, #D26C44   0%, #8B3F2B  100%)]">
                Explore Our Unique
              </span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                E-commerce Experience
              </span>
            </motion.h1>
            
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
  onClick={handleExploreClick}
  whileHover={{ 
    scale: 1.05,
    boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
  }}
  whileTap={{ scale: 0.95 }}
  className="px-8 py-3 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg"
  style={{
    backgroundImage: 'linear-gradient(135deg, #D26C44 0%, #8B3F2B 100%)'
  }}
>
  Discover Now <FiArrowRight />
</motion.button>

            </motion.div>
          </div>

          {/* Product Image (Right Side) with Scaling Animation and White Inset */}
          <motion.div 
            className="w-full lg:w-1/2 relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.10, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* White inset background */}
              <div className="absolute inset-0 bg-white rounded-xl -z-10 transform translate-x-6 translate-y-6"></div>
              
              {/* Secondary inset background (amber) */}
              <div className="absolute inset-0 bg-amber-400/10 rounded-xl -z-20 transform translate-x-12 translate-y-12"></div>
              
              {/* Main image */}
              <img 
                src={productImage} 
                alt="Featured Product" 
                className="w-full max-w-md ml-auto rounded-xl shadow-2xl border border-gray-700/50 relative z-10"
                draggable="false"
              />
              
              {/* Glow effect */}
              <motion.div 
                className="absolute -inset-4 rounded-xl border-2 border-amber-400/30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
      {/* Features Section with White Background - Zig Zag Layout */}
      <section className="relative z-20 bg-white py-16">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Premium Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed to elevate your shopping experience to new heights
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden ${feature.position}`}
                whileHover={{ 
                  y: -5,
                  scale: 1.02
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: feature.id * 0.1
                }}
              >
                <div className="p-4 h-full">
                  <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-6 mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 text-center">{feature.description}</p>
                 
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceBanner;