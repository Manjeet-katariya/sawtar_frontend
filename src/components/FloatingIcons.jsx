import React from 'react';
import { FaWhatsapp, FaPhone, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FloatingIcons = () => {
  const icons = [
    {
      icon: <FaWhatsapp size={24} color="white" />,
      bg: 'bg-green-500',
      href: 'https://wa.me/yourwhatsappnumber',
      tooltip: 'Chat on WhatsApp'
    },
    {
      icon: <FaPhone size={24} color="white" />,
      bg: 'bg-blue-500',
      href: 'tel:yourphonenumber',
      tooltip: 'Call Us'
    },
    {
      icon: <FaYoutube size={24} color="white" />,
      bg: 'bg-red-600',
      href: 'https://www.youtube.com/@sawtarluxeInteriors',
      tooltip: 'YouTube Channel'
    },
    {
      icon: <FaInstagram size={24} color="white" />,
      bg: 'bg-gradient-to-tr from-purple-500 to-pink-500',
      href: 'https://www.instagram.com/sawtarluxe_interior/',
      tooltip: 'Instagram'
    },
    {
      icon: <FaLinkedin size={24} color="white" />,
      bg: 'bg-[#0A66C2]',
      href: 'https://www.linkedin.com/company/sawtar-luxeinterior',
      tooltip: 'LinkedIn Page'
    }
  ];

  return (
    <div className="fixed right-1 bottom-40 flex flex-col items-center space-y-3 z-50 bg-black/40 p-2">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="group relative"
        >
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className={`${item.bg} p-3 rounded-full shadow-lg hover:shadow-xl transition-all`}>
              {item.icon}
            </div>
          </a>
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {item.tooltip}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-black"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIcons;