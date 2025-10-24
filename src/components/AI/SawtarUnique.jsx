import React from 'react';
import { FaCogs, FaLightbulb, FaShoppingCart, FaBalanceScale, FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SawtarUnique = () => {
  const features = [
    { 
      icon: <FaCogs className="text-[#D26C44]" size={50} />, 
      title: "AI-Powered Interior Modeling", 
      subtitle: "Visualize any space in 3D instantly with our advanced AI technology" 
    },
    { 
      icon: <FaLightbulb className="text-[#D26C44]" size={50} />, 
      title: "Smart Suggestions", 
      subtitle: "Get personalized design ideas tailored to your taste via AI" 
    },
    { 
      icon: <FaShoppingCart className="text-[#D26C44]" size={50} />, 
      title: "Integrated E-commerce", 
      subtitle: "Seamlessly buy products as you design your perfect space" 
    },
    { 
      icon: <FaBalanceScale className="text-[#D26C44]" size={50} />, 
      title: "Pre-Purchase Comparison", 
      subtitle: "Compare products, prices and styles with ease" 
    },
    { 
      icon: <FaComments className="text-[#D26C44]" size={50} />, 
      title: "Live Consultation", 
      subtitle: "Chat with design experts for instant professional help" 
    },
  ];

  return (
    <section className="bg-[#1A132F] text-[#F7F1E5] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Makes <span className="text-[#D26C44]">Sawtar</span> Unique
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-[#F7F1E5]/90">
            Revolutionizing interior design with cutting-edge technology and seamless shopping experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-[#2A1B3D]/50 p-6 rounded-xl border border-[#3E2A5D] hover:border-[#D26C44]/50 transition-all"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 rounded-full bg-[#2A1B3D] flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#F7F1E5]/80 text-sm flex-grow">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
     
        </motion.div>
      </div>
    </section>
  );
};

export default SawtarUnique;