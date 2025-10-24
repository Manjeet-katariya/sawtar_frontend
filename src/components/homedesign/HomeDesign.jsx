import React from 'react';
import { motion } from 'framer-motion';
import video from '../../assets/video/illustrationvideos.mp4';
import { FaCouch, FaRulerCombined, FaPaintRoller } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomeDesign = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-white text-gray-900 relative overflow-hidden">

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-4"
      >
        AI-Powered Home Design Studio
      </motion.h2>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center text-lg md:text-xl mb-6 max-w-2xl mx-auto"
      >
        Create your dream home with intelligent design recommendations, virtual previews, and more.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto block bg-gradient-to-r from-[#BA5933] via-orange-500 to-[#BA5933] 
             bg-[length:200%_200%] bg-left hover:bg-right 
             px-10 py-3 rounded-full font-semibold text-white shadow-md 
             transition-all duration-700 ease-in-out animate-gradient-slide"
        onClick={() => navigate("/sawtar/designs")}
      >
        Explore Now
      </motion.button>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-10 mb-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
      >
        {[
          { value: "1500+", label: "Homes Designed" },
          { value: "AI Powered", label: "Smart Suggestions" },
          { value: "100%", label: "Client Satisfaction" },
          { value: "50+", label: "Design Styles" }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Video with Icons */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-12 relative max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl"
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden md:block absolute left-[-60px] top-1/2 transform -translate-y-1/2 text-orange-400 text-5xl animate-bounce-slow"
        >
          <FaCouch />
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden md:block absolute right-[-60px] top-1/2 transform -translate-y-1/2 text-yellow-500 text-5xl animate-bounce-slow"
        >
          <FaPaintRoller />
        </motion.div>

        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="w-full max-h-[500px] object-cover rounded-2xl"
        />
      </motion.div>

      {/* AR & VR Integration Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-20 bg-gray-50 py-12 px-6 rounded-2xl shadow-inner max-w-6xl mx-auto"
      >
        <h3 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Virtual Showroom with AR & VR Integration
        </h3>
        <p className="text-center text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Experience your dream space before it’s built. Explore a 3D walkthrough of various interior themes and place virtual furniture, décor, and materials in your space using AR/VR technologies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-xl shadow border">
            <FaRulerCombined className="text-4xl text-orange-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">3D Walkthrough</h4>
            <p className="text-gray-600 text-sm">Navigate through different interior designs in immersive 3D environments.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border">
            <FaCouch className="text-4xl text-orange-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Virtual Placement</h4>
            <p className="text-gray-600 text-sm">Place and customize furniture, décor, and materials in your real space using AR.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border">
            <FaPaintRoller className="text-4xl text-yellow-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Cross-Platform Support</h4>
            <p className="text-gray-600 text-sm">Compatible with ARCore (Android), ARKit (iOS), and VR headsets using Unity & WebXR.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeDesign;
