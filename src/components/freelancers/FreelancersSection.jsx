import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiStar, FiBriefcase, FiDollarSign, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FreelancersSlider = ({ heading }) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with center card selected

  // Sample interior designer data
  const freelancers = [
    {
      id: 1,
      name: 'Emma Thompson',
      title: 'Interior Designer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.9,
      rate: '$80/hr',
      experience: '6 years',
      location: 'Los Angeles, CA',
      skills: ['Space Planning', '3D Rendering', 'Furniture Design', 'Color Theory'],
      bio: 'Specializing in modern and minimalist interior designs for residential spaces.'
    },
    {
      id: 2,
      name: 'Liam Carter',
      title: 'Interior Designer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      rate: '$85/hr',
      experience: '8 years',
      location: 'New York, NY',
      skills: ['Commercial Design', 'AutoCAD', 'Lighting Design', 'Sustainable Design'],
      bio: 'Expert in creating functional and aesthetic commercial interiors with a focus on sustainability.'
    },
    {
      id: 3,
      name: 'Sophia Martinez',
      title: 'Interior Designer',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 4.7,
      rate: '$70/hr',
      experience: '5 years',
      location: 'Miami, FL',
      skills: ['Residential Design', 'Revit', 'Textile Selection', 'Custom Furniture'],
      bio: 'Passionate about crafting vibrant and personalized home interiors.'
    },
    {
      id: 4,
      name: 'Noah Bennett',
      title: 'Interior Designer',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 4.8,
      rate: '$90/hr',
      experience: '7 years',
      location: 'Chicago, IL',
      skills: ['Hospitality Design', 'SketchUp', 'Material Sourcing', 'Project Management'],
      bio: 'Focused on designing inviting spaces for hotels and restaurants.'
    },
    {
      id: 5,
      name: 'Isabella Lee',
      title: 'Interior Designer',
      image: 'https://randomuser.me/api/portraits/women/25.jpg',
      rating: 4.9,
      rate: '$95/hr',
      experience: '6 years',
      location: 'San Francisco, CA',
      skills: ['Eco-Friendly Design', '3ds Max', 'Space Optimization', 'Color Consulting'],
      bio: 'Dedicated to sustainable and innovative interior solutions for modern living.'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === freelancers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? freelancers.length - 1 : prevIndex - 1
    );
  };

  // Calculate previous and next indices for the side cards
  const prevIndex = currentIndex === 0 ? freelancers.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === freelancers.length - 1 ? 0 : currentIndex + 1;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-200 to-gray-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Discover top interior designers to transform your space
          </p>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Previous slide"
          >
            <FiArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Next slide"
          >
            <FiArrowRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Freelancer cards - 3 column layout */}
          <div className="flex items-center justify-center gap-6">
            {/* Left card (small) */}
            <div 
              className="w-64 transform transition-all duration-300 hover:scale-105 opacity-80 hover:opacity-100"
              onClick={() => setCurrentIndex(prevIndex)}
            >
              <FreelancerCard freelancer={freelancers[prevIndex]} isSmall={true} />
            </div>

            {/* Center card (large) */}
            <div className="w-96 z-10">
              <FreelancerCard freelancer={freelancers[currentIndex]} isSmall={false} />
            </div>

            {/* Right card (small) */}
            <div 
              className="w-64 transform transition-all duration-300 hover:scale-105 opacity-80 hover:opacity-100"
              onClick={() => setCurrentIndex(nextIndex)}
            >
              <FreelancerCard freelancer={freelancers[nextIndex]} isSmall={true} />
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {freelancers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all duration-200 ${currentIndex === index ? 'bg-[#D26C44] w-6' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Reusable Freelancer Card Component
const FreelancerCard = ({ freelancer, isSmall }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${isSmall ? 'opacity-80 hover:opacity-100' : 'shadow-xl border-2 border-[#D26C44]/20'}`}>
      {/* Profile header */}
      <div className={`p-6 ${isSmall ? 'pb-2' : ''}`}>
        <div className="flex items-center">
          <img 
            className={`${isSmall ? 'h-12 w-12' : 'h-20 w-20'} rounded-full object-cover border-2 border-[#D26C44]/30`}
            src={freelancer.image} 
            alt={freelancer.name}
          />
          <div className={`ml-4 ${isSmall ? 'truncate' : ''}`}>
            <h3 className={`${isSmall ? 'text-base' : 'text-xl'} font-semibold text-gray-900`}>{freelancer.name}</h3>
            <p className={`${isSmall ? 'text-sm' : 'text-lg'} text-[#D26C44] font-medium`}>{freelancer.title}</p>
            {!isSmall && (
              <div className="flex items-center mt-2">
                <FiStar className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-gray-600">{freelancer.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className={`px-6 ${isSmall ? 'py-2' : 'pb-4'}`}>
        {!isSmall && (
          <div className="flex flex-wrap gap-2 mb-4">
            {freelancer.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D26C44]/10 text-[#D26C44]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {!isSmall && (
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <FiBriefcase className="h-4 w-4 text-[#D26C44] mr-2" />
              <span>{freelancer.experience}</span>
            </div>
            <div className="flex items-center">
              <FiDollarSign className="h-4 w-4 text-[#D26C44] mr-2" />
              <span>{freelancer.rate}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="h-4 w-4 text-[#D26C44] mr-2" />
              <span>Available now</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="h-4 w-4 text-[#D26C44] mr-2" />
              <span>{freelancer.location}</span>
            </div>
          </div>
        )}

        {/* Button */}
        <div className="px-6 pb-6">
          <Link 
            to="/sawtar/freelancer/browse-category" 
            className={`block text-center ${isSmall ? 'py-1 px-3 text-sm' : 'py-2 px-4'} rounded-lg font-medium text-white bg-[#D26C44] hover:bg-[#C45A32] transition-colors duration-200`}
          >
            {isSmall ? 'View' : 'Consult Now'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelancersSlider;