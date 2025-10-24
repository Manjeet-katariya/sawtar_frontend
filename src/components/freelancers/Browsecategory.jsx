import React, { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiX, FiFilter,FiChevronDown,FiChevronUp,  FiHome,
  } from 'react-icons/fi';
import { FaStar, FaRegStar, FaCheckCircle, FaMapMarkerAlt, FaEnvelope, FaLink ,FaDollarSign,FaExchangeAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import image from "../../assets/img/Freelancer/enquiry.png";
import { motion } from "framer-motion";
import { 
  FiSearch,
  FiHeart,
  FiBriefcase,
  FiTruck,
  FiBook
} from 'react-icons/fi';


const FreelancerCard = ({ service }) => {
  const workSliderRef = useRef();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowModal(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const scrollWorkLeft = () => {
    workSliderRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollWorkRight = () => {
    workSliderRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <FaStar key={i} className="text-[#D26C44] inline-block text-sm" />;
          } else if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="relative">
                <FaRegStar className="text-[#D26C44] inline-block text-sm" />
                <FaStar className="text-[#D26C44] inline-block text-sm absolute top-0 left-0 w-1/2 overflow-hidden" />
              </div>
            );
          } else {
            return <FaRegStar key={i} className="text-gray-300 inline-block text-sm" />;
          }
        })}
        <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Comparison data with other platforms
  const comparisonData = [
    {
      platform: "Our Platform",
      name: service.user,
      rating: service.rating,
      price: service.price,
      responseTime: "Within 24 hours",
      deliveryTime: "3-7 days",
      quality: "Premium verified professionals",
      guarantee: "100% satisfaction guarantee",
      benefits: ["Direct communication", "AI matching", "Secure payments", "Project management tools"],
      image: service.profileImg
    },
    {
      platform: "Urban Company",
      name: "Similar Professional",
      rating: Math.max(3.5, Math.min(5, service.rating + (Math.random() - 0.5))),
      price: `₹${Math.round(parseInt(service.price.replace('₹', '')) * 1.2)}`,
      responseTime: "Within 48 hours",
      deliveryTime: "5-10 days",
      quality: "Verified professionals",
      guarantee: "Service guarantee",
      benefits: ["Platform managed", "Standardized pricing", "Customer support"],
      image: "https://via.placeholder.com/80?text=Urban"
    },
    {
      platform: "Housejoy",
      name: "Similar Professional",
      rating: Math.max(3, Math.min(4.8, service.rating + (Math.random() - 0.7))),
      price: `₹${Math.round(parseInt(service.price.replace('₹', '')) * 1.15)}`,
      responseTime: "Within 72 hours",
      deliveryTime: "7-14 days",
      quality: "Background checked",
      guarantee: "Limited guarantee",
      benefits: ["Scheduled services", "Multiple options", "Basic support"],
      image: "https://via.placeholder.com/80?text=Housejoy"
    },
    {
      platform: "Local Provider",
      name: "Local Professional",
      rating: Math.max(2.5, Math.min(4.5, service.rating + (Math.random() - 0.9))),
      price: `₹${Math.round(parseInt(service.price.replace('₹', '')) * 0.9)}`,
      responseTime: "Varies",
      deliveryTime: "Not guaranteed",
      quality: "Unverified",
      guarantee: "No guarantee",
      benefits: ["Potentially cheaper", "Local knowledge", "Direct dealing"],
      image: "https://via.placeholder.com/80?text=Local"
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 space-y-4 border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
    

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <img 
              alt={`Profile image of ${service.user}`} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" 
              src={service.profileImg} 
            />
            {service.isPro && (
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#D26C44] to-[#e67e5a] text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center shadow-md">
                <FaCheckCircle className="mr-1" /> PRO
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Name and View Profile */}
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900 font-semibold text-lg truncate">
                  {service.user}
                </h3>
                <span className="hidden sm:block text-gray-400">|</span>
                <button 
                  onClick={() => navigate(`/sawtar/freelancer/profile`)}
                  className="text-[#D26C44] hover:text-[#c05a38] text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <FaLink className="text-xs" />
                  <span>View Profile</span>
                </button>
              </div>

              {/* Price Highlight */}
              <div className="flex items-center gap-2 bg-[#f8f5ff] px-3 py-1.5 rounded-full border border-[#e9e0ff]">
                <FaDollarSign className="text-[#D26C44] text-sm" />
                <span className="font-bold text-[#1A132F] text-sm sm:text-base">
                  {service.price}
                </span>
                <span className="text-gray-500 text-xs">/project</span>
              </div>
            </div>

            {/* Location and Availability */}
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-gray-500 text-sm mt-1.5">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-1.5 text-xs" />
                <span>{service.location}</span>
              </div>
              <div className={`flex items-center ${service.available ? 'text-green-600' : 'text-gray-500'}`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${service.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="font-medium">
                  {service.available ? 'Available now' : 'Not available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="flex flex-wrap gap-2">
        {service.skills.slice(0, 5).map((skill, idx) => (
          <span 
            key={idx} 
            className="text-xs font-medium text-[#1A132F] bg-[#f3f1f7] rounded-full px-3 py-1"
          >
            {skill}
          </span>
        ))}
        {service.skills.length > 5 && (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-1">
            +{service.skills.length - 5}
          </span>
        )}
      </div>

      {/* Work Section */}
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-900 font-semibold text-sm flex items-center gap-1 cursor-pointer group-hover:text-[#1A132F] transition-colors">
            Recent Work
            <FiChevronDown className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <div className="flex items-center text-xs text-gray-500">
            {service.workImgs.length} projects
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={workSliderRef}
            className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
          >
            {service.workImgs.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0 w-28 h-20 rounded-md overflow-hidden group">
                <img 
                  alt={`Project ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  src={img} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A132F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-white text-xs font-medium">Project {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
          
          {service.workImgs.length > 3 && (
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
              <button 
                onClick={scrollWorkLeft}
                className="pointer-events-auto bg-white/90 hover:bg-white text-[#1A132F] p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous work"
              >
                <FiChevronLeft className="text-lg" />
              </button>
              <button 
                onClick={scrollWorkRight}
                className="pointer-events-auto bg-white/90 hover:bg-white text-[#1A132F] p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next work"
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-[#D26C44] hover:bg-[#c05a38] text-white font-semibold rounded-lg px-4 py-3 transition-colors"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
        >
          <FaEnvelope />
          Send Enquiry
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/sawtar/login`);
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1A132F] hover:bg-[#2a1d4a] text-white font-semibold rounded-lg px-4 py-3 transition-colors"
        >
          Book Now
        </button>
         <button 
                onClick={() => setShowCompareModal(true)}

          className="flex-1 flex items-center justify-center gap-2 bg-[#1A132F] hover:bg-[#2a1d4a] text-white font-semibold rounded-lg px-4 py-3 transition-colors"
        >          <FaExchangeAlt />

          Compare
        </button>
      </div>

      {/* Rating Section */}
      <div className="flex items-center gap-2 text-gray-900 text-sm font-medium pt-2">
        <div className="bg-[#D26C44] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {service.rating.toFixed(1)}
        </div>
        {renderStars(service.rating)}
        <span className="text-gray-500 text-xs">
          ({service.completedProjects || 42} projects completed)
        </span>
        <button 
          onClick={() => navigate(`/sawtar/freelancer/profile#reviews`)}
          className="text-[#1A132F] hover:underline font-normal ml-auto text-sm"
        >
          Read Reviews
        </button>
      </div>

      {/* Enquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-5xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="text-2xl" />
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Form Section */}
              <div className="w-full md:w-1/2 p-6">
                <h2 className="text-2xl font-bold text-[#1A132F] mb-2">Contact {service.user}</h2>
                <p className="text-[#D26C44] mb-6">Send a message to discuss your project</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email*</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message*</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={`Hi ${service.user.split(' ')[0]}, I'm interested in your services...`}
                      rows="4"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent transition-all"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#D26C44] hover:bg-[#c05a38] text-white font-semibold rounded-lg px-6 py-3 transition duration-200 transform hover:scale-[1.02]"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1A132F] to-[#3A1C71] p-6 text-white flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src={service.profileImg} 
                    alt={service.user}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{service.user}</h3>
                    <p className="text-blue-100 text-sm">{service.category} Specialist</p>
                    <div className="flex items-center mt-1">
                      <div className="bg-[#D26C44] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-1">
                        {service.rating.toFixed(1)}
                      </div>
                      {renderStars(service.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Why work with {service.user.split(' ')[0]}?</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Starting at {service.price} per project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>{service.rating.toFixed(1)}+ rating from {service.completedProjects} projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Specializes in {service.skills.slice(0, 2).join(' and ')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response time:</span>
                      <span className="font-medium">Within 24 hours</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Delivery time:</span>
                      <span className="font-medium">3-7 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed top-15 inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-6xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="text-2xl" />
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#1A132F] mb-2">Compare Service Providers</h2>
              <p className="text-[#D26C44] mb-6">See how {service.user} compares to other platforms</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 font-semibold text-gray-700">Platform</th>
                      {comparisonData.map((item, idx) => (
                        <th key={idx} className="pb-4 font-semibold text-gray-700">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.platform} 
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <div className="font-bold">{item.platform}</div>
                              <div className="text-xs text-gray-500">{item.name}</div>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-4 font-medium text-gray-700">Rating</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#D26C44] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {item.rating.toFixed(1)}
                            </div>
                            {renderStars(item.rating)}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-gray-700">Price</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          <span className={`font-bold ${idx === 0 ? 'text-[#D26C44]' : 'text-gray-800'}`}>
                            {item.price}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-gray-700">Response Time</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          <span className={idx === 0 ? 'text-[#1A132F] font-semibold' : 'text-gray-600'}>
                            {item.responseTime}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-gray-700">Delivery Time</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          <span className={idx === 0 ? 'text-[#1A132F] font-semibold' : 'text-gray-600'}>
                            {item.deliveryTime}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-gray-700">Quality</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          <span className={idx === 0 ? 'text-[#1A132F] font-semibold' : 'text-gray-600'}>
                            {item.quality}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-gray-700">Guarantee</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          <span className={idx === 0 ? 'text-[#1A132F] font-semibold' : 'text-gray-600'}>
                            {item.guarantee}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-gray-700">Benefits</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          <ul className="space-y-1">
                            {item.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span className={idx === 0 ? 'text-[#1A132F]' : 'text-gray-600'}>
                                  {benefit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-gray-700">AI Recommendation</td>
                      {comparisonData.map((item, idx) => (
                        <td key={idx} className="py-4">
                          {idx === 0 ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              Best Match
                            </span>
                          ) : idx === comparisonData.length - 1 ? (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                              Risky Choice
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                              Good Alternative
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-[#1A132F] mb-2">AI Analysis Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#D26C44] mb-2">Why choose {service.user}?</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Higher rating ({service.rating.toFixed(1)}) than most alternatives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Faster response and delivery times</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>More comprehensive service guarantee</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#D26C44] mb-2">Considerations</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>Local providers may offer lower prices but with less reliability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>Large platforms have more standardized processes but less personalization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>Our platform offers the best balance of quality, price, and service</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="border border-[#1A132F] text-[#1A132F] font-semibold rounded-lg px-6 py-2 hover:bg-[#1A132F] hover:text-white transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowCompareModal(false);
                    navigate(`/sawtar/login`);
                  }}
                  className="bg-[#D26C44] hover:bg-[#c05a38] text-white font-semibold rounded-lg px-6 py-2 transition"
                >
                  Book {service.user}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSidebar = ({ 
  activeCategory, 
  setActiveCategory,
  activeSubCategory,
  setActiveSubCategory,
  search, 
  setSearch,
  selectedSkills,
  setSelectedSkills,
  minRating,
  setMinRating,
  availability,
  setAvailability,
  priceRange,
  setPriceRange,
  countryFilter,
  setCountryFilter,
  regionFilter,
  setRegionFilter,
  cityFilter,
  setCityFilter,
  typeFilter,
  setTypeFilter
}) => {
  const sliderRef = useRef();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    type: true,
    location: false,
    price: false,
    skills: false,
    rating: false,
    availability: false,
    category: false
  });
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Toggle accordion sections
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle category expansion
  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    setActiveCategory(categoryName);
    setActiveSubCategory('All');
  };

  // Category data with subcategories
  const categories = [
    {
      name: "Home Services",
      icon: <FiHome />,
      subcategories: [
        "AC Service", 
        "Electricians", 
        "Plumbers", 
        "House Keeping",
        "Pest Control"
      ]
    },
    {
      name: "Health & Beauty",
      icon: <FiHeart />,
      subcategories: [
        "Dermatologists",
        "Dentists",
        "Body Massage",
        "Beauty Spa",
        "Hair Salons"
      ]
    },
    {
      name: "Professional Services",
      icon: <FiBriefcase />,
      subcategories: [
        "Chartered Accountant",
        "Lawyers",
        "Interior Designers",
        "Architects",
        "Consultants"
      ]
    },
    {
      name: "Automotive",
      icon: <FiTruck />,
      subcategories: [
        "Car Hire",
        "Car Repair",
        "Car Wash",
        "Auto Parts"
      ]
    },
    {
      name: "Education",
      icon: <FiBook />,
      subcategories: [
        "Computer Training",
        "Coaching",
        "Vocational Training",
        "Tutoring"
      ]
    }
  ];

  const skillsOptions = [
    "Website Design", "Logo Design", "Branding", "App Design", "UI/UX",
    "Graphic Design", "Illustration", "Animation", "3D Modeling", "Video Editing"
  ];

  // Location data
  const countries = ["Bangladesh", "India", "USA", "UK", "Canada"];
  const regionsByCountry = {
    "Bangladesh": ["Dhaka Division", "Chittagong Division", "Sylhet Division"],
    "India": ["West Bengal", "Delhi", "Maharashtra"],
    "USA": ["California", "New York", "Texas"],
    "UK": ["England", "Scotland", "Wales"],
    "Canada": ["Ontario", "Quebec", "British Columbia"]
  };
  const citiesByRegion = {
    "Dhaka Division": ["Dhaka", "Gazipur", "Narayanganj"],
    "Chittagong Division": ["Chittagong", "Cox's Bazar", "Comilla"],
    "Sylhet Division": ["Sylhet", "Moulvibazar", "Habiganj"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
    "Delhi": ["New Delhi", "Noida", "Gurgaon"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "California": ["Los Angeles", "San Francisco", "San Diego"],
    "New York": ["New York City", "Buffalo", "Rochester"],
    "Texas": ["Houston", "Dallas", "Austin"],
    "England": ["London", "Manchester", "Birmingham"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen"],
    "Wales": ["Cardiff", "Swansea", "Newport"],
    "Ontario": ["Toronto", "Ottawa", "Mississauga"],
    "Quebec": ["Montreal", "Quebec City", "Laval"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey"]
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleSubCategorySelect = (category, subcategory) => {
    setActiveCategory(category);
    setActiveSubCategory(subcategory);
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button 
        onClick={() => setIsMobileSidebarOpen(true)}
        className="md:hidden flex items-center gap-2 bg-[#D26C44] text-white px-4 py-2 rounded-lg mb-4"
      >
        <FiFilter /> Filters
      </button>

      {/* Sidebar */}
      <div className={`${isMobileSidebarOpen ? 'block' : 'hidden'} md:block fixed md:static inset-0 z-40 md:z-auto bg-white md:bg-transparent overflow-y-auto`}>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 md:w-[280px] h-full md:h-auto md:sticky md:top-4 md:overflow-y-auto">
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-2xl" />
          </button>

          <h2 className="text-xl font-bold text-[#1A132F] mb-4 flex items-center gap-2">
            <FiFilter /> Filters
          </h2>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Type Filter Accordion */}
          <div className="mb-4 border-b border-gray-100 pb-4">
            <button 
              onClick={() => toggleSection('type')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700">Type</h3>
              {openSections.type ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.type && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTypeFilter('freelancer')}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    typeFilter === 'freelancer' 
                      ? 'bg-[#D26C44] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Freelancers
                </button>
                <button
                  onClick={() => setTypeFilter('service')}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    typeFilter === 'service' 
                      ? 'bg-[#D26C44] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Services
                </button>
              </div>
            )}
          </div>

          {/* Category Filter Accordion */}
                 <div className="mb-4 border-b border-gray-100 pb-4">
            <button 
              onClick={() => toggleSection('category')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
              {openSections.category ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.category && (
              <div className="mt-3 space-y-3">
                {categories.map((category) => (
                  <div key={category.name}>
                    {/* Main Category */}
                    <button
                      onClick={() => handleCategorySelect(category.name)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 ${
                        activeCategory === category.name && activeSubCategory === 'All'
                          ? 'bg-[#D26C44] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon}
                      {category.name}
                    </button>
                    
                    {/* Subcategories */}
                    <div className="ml-6 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => handleCategorySelect(category.name, subcategory)}
                          className={`w-full text-left px-3 py-1 rounded text-xs block ${
                            activeCategory === category.name && activeSubCategory === subcategory
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Location Filter Accordion */}
          <div className="mb-4 border-b border-gray-100 pb-4">
            <button 
              onClick={() => toggleSection('location')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700">Location</h3>
              {openSections.location ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.location && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Country</label>
                  <select
                    value={countryFilter}
                    onChange={(e) => {
                      setCountryFilter(e.target.value);
                      setRegionFilter('All');
                      setCityFilter('All');
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent"
                  >
                    <option value="All">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {countryFilter !== 'All' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Region/State</label>
                    <select
                      value={regionFilter}
                      onChange={(e) => {
                        setRegionFilter(e.target.value);
                        setCityFilter('All');
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent"
                    >
                      <option value="All">All Regions</option>
                      {regionsByCountry[countryFilter]?.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                )}

                {regionFilter !== 'All' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent"
                    >
                      <option value="All">All Cities</option>
                      {citiesByRegion[regionFilter]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Range Accordion */}
          <div className="mb-4 border-b border-gray-100 pb-4">
            <button 
              onClick={() => toggleSection('price')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700">Price Range</h3>
              {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.price && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">$0</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">$1000+</span>
                </div>
                <div className="text-center text-sm font-medium">
                  ${priceRange === "1000" ? "1000+" : priceRange}
                </div>
              </div>
            )}
          </div>

          {/* Skills Filter Accordion */}
          <div className="mb-4 border-b border-gray-100 pb-4">
            <button 
              onClick={() => toggleSection('skills')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700">Skills</h3>
              {openSections.skills ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.skills && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skillsOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#D26C44] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rating Filter Accordion */}
          <div className="mb-4 border-b border-gray-100 pb-4">
            <button 
              onClick={() => toggleSection('rating')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700">Minimum Rating</h3>
              {openSections.rating ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.rating && (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setMinRating(star)}
                      className={`text-xl ${star <= minRating ? 'text-[#D26C44]' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{minRating}+</span>
                </div>
              </div>
            )}
          </div>

          {/* Availability Filter Accordion */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSection('availability')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700">Availability</h3>
              {openSections.availability ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.availability && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => setAvailability('all')}
                  className={`px-3 py-1 rounded text-xs ${
                    availability === 'all' 
                      ? 'bg-[#D26C44] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setAvailability('available')}
                  className={`px-3 py-1 rounded text-xs ${
                    availability === 'available' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Available Now
                </button>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setActiveCategory('All');
              setActiveSubCategory('All');
              setSearch('');
              setSelectedSkills([]);
              setMinRating(0);
              setAvailability('all');
              setPriceRange(1000);
              setCountryFilter('All');
              setRegionFilter('All');
              setCityFilter('All');
              setTypeFilter('freelancer');
              setExpandedCategory(null);
            }}
            className="w-full mt-4 px-4 py-2 border border-[#D26C44] text-[#D26C44] rounded-lg hover:bg-[#f8e9e4] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};
const Browsecategory = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState('all');
  const navigate = useNavigate();


  const dummyData = [
    {
      title: "Website Design",
      price: "$200",
      user: "Shahid Miah",
      location: "Dhaka, Bangladesh",
      rating: 4.7,
      workImgs: [
        "https://storage.googleapis.com/a1aa/image/e1eae4ac-5b35-4711-66ec-3724a24c56e5.jpg",
        "https://storage.googleapis.com/a1aa/image/a68d7b8f-67c9-4d3a-e3a9-d25cd9296fe2.jpg",
        "https://storage.googleapis.com/a1aa/image/44e135f8-063a-4ed1-cfec-2409536de360.jpg",
        "https://storage.googleapis.com/a1aa/image/e548a035-3de3-4736-c4cb-b68d6de7538f.jpg"
      ],
      profileImg: "https://storage.googleapis.com/a1aa/image/7d2e230a-6980-48a0-7605-adbcfb2d5aec.jpg",
      category: "UI/UX Design",
      isPro: true,
      available: true,
      skills: ["Website Design", "Logo Design", "Branding Services", "App Design", "UI/UX Design"],
      completedProjects: 42
    },
    {
      title: "Mobile App Design",
      price: "$300",
      user: "Alex Johnson",
      location: "San Francisco, USA",
      rating: 4.2,
      workImgs: [
        "https://storage.googleapis.com/a1aa/image/44e135f8-063a-4ed1-cfec-2409536de360.jpg",
        "https://storage.googleapis.com/a1aa/image/e548a035-3de3-4736-c4cb-b68d6de7538f.jpg",
        "https://storage.googleapis.com/a1aa/image/1e54e763-bcb1-427e-3fce-014b6173a37b.jpg"
      ],
      profileImg: "https://randomuser.me/api/portraits/men/32.jpg",
      category: "App Design",
      isPro: true,
      available: false,
      skills: ["App Design", "UI/UX Design", "Prototyping"],
      completedProjects: 28
    },
    {
      title: "Brand Identity",
      price: "$250",
      user: "Sarah Williams",
      location: "London, UK",
      rating: 4.9,
      workImgs: [
        "https://storage.googleapis.com/a1aa/image/a68d7b8f-67c9-4d3a-e3a9-d25cd9296fe2.jpg",
        "https://storage.googleapis.com/a1aa/image/c5db5c1d-24a3-409b-3c38-da5e35f537b0.jpg"
      ],
      profileImg: "https://randomuser.me/api/portraits/women/44.jpg",
      category: "Branding",
      isPro: false,
      available: true,
      skills: ["Logo Design", "Branding Services", "Graphic Design"],
      completedProjects: 35
    }
  ];

  const filteredData = dummyData.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase()) || 
                         service.user.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || service.category === activeCategory;
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => service.skills.includes(skill));
    const matchesRating = service.rating >= minRating;
    const matchesAvailability = availability === 'all' || 
                              (availability === 'available' && service.available);
    
    return matchesSearch && matchesCategory && matchesSkills && matchesRating && matchesAvailability;
  });

  return (
    <>
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 flex items-center justify-center text-white text-center bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A132F]/90 to-[#3A1C71]/90"></div>
        <div className="relative z-10  max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 drop-shadow-lg">
            Find Top Talent Freelancers
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md">
            Connect with skilled professionals ready to bring your projects to life
          </p>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            search={search}
            setSearch={setSearch}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            minRating={minRating}
            setMinRating={setMinRating}
            availability={availability}
            setAvailability={setAvailability}
          />

          {/* Content Area */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#1A132F]">
                {filteredData.length} {filteredData.length === 1 ? 'Freelancer' : 'Freelancers'} Found
              </h2>
              <div className="text-sm text-gray-500">
                Showing results for: <span className="font-medium text-[#D26C44]">{activeCategory}</span>
              </div>
            </div>

            {/* Freelancer Cards */}
            <div className="grid grid-cols-1 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((service, index) => (
                  <FreelancerCard key={index} service={service} />
                ))
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No freelancers found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setActiveCategory('All');
                      setSelectedSkills([]);
                      setMinRating(0);
                      setAvailability('all');
                    }}
                    className="px-4 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#c05a38] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
   
    </>
  );
};  

export default Browsecategory;