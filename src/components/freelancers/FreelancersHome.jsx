// src/pages/HomePage.jsx
import React from 'react';
import backgroundImage from '../../assets/img/homepageimage2-min.png';
import {
  CurrencyDollarIcon,
  SparklesIcon,
  CheckBadgeIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

import Toast from '../Toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
const FreelancersHome = () => {
  return (
    <div className="font-sans bg-gray-50 overflow-hidden">
      <HeroSection />
      <FeaturesSection />
    <ServiceModels/>
                   <Toast />
      
    </div>
  );
};

export default FreelancersHome;

// src/sections/HeroSection.jsx
const HeroSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Color palette based on #C05A34
  const colors = {
    primary: "#C05A34",
    primaryLight: "#E07A54",
    primaryDark: "#A04024",
    secondary: "#3498C0",
    accent: "#34C05A",
    neutral: "#F5F5F5"
  };

  const stats = [
    { value: '50K+', label: 'Freelancers' },
    { value: '10K+', label: 'Businesses' },
    { value: '98%', label: 'Satisfaction' },
    { value: '24h', label: 'Avg. Hire Time' }
  ];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center text-center bg-white pb-20 overflow-hidden"
      style={{ backgroundColor: colors.neutral }}
    >
      {/* Background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/30" />

      <div ref={ref} className="relative z-10 px-6 max-w-7xl mx-auto">
        {/* Main heading with fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 text-gray-900 leading-tight">
            Build Your Dream Team <br />
            <span 
              className="text-transparent bg-clip-text" 
              style={{ backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})` }}
            >
              With Top 1% Talent
            </span>
          </h1>
        </motion.div>
        
        {/* Subheading with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Access a global network of vetted professionals across 200+ skills. 
            Get matched with perfect candidates in 24 hours or less.
          </p>
        </motion.div>
        
        {/* CTA Buttons with fade-in-right animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <button
            onClick={() => navigate('/sawtar/freelancer/free-listing')}
            className="px-8 py-4 bg-white border border-gray-200 hover:border-[#C05A34] text-gray-900 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group relative overflow-hidden"
            style={{ boxShadow: '0 4px 14px rgba(192, 90, 52, 0.1)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C05A34]/10 to-[#E07A54]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg
              className="w-6 h-6 group-hover:animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: colors.primary }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Create Business
          </button>
          <button
            onClick={() => navigate('/sawtar/freelancer/category')}
            className="px-8 py-4 text-white rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group relative overflow-hidden"
            style={{ 
              background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight})`,
              boxShadow: '0 4px 14px rgba(192, 90, 52, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg
              className="w-6 h-6 group-hover:animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Explore Categories
          </button>
        </motion.div>
        
        {/* Stats with staggered fade-in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:border-[#C05A34]"
              whileHover={{ y: -5 }}
            >
              <div 
                className="text-3xl font-bold mb-1"
                style={{ color: colors.primary }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Scroll indicator with animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0, 1, 0],
          y: [0, 10, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          delay: 1.5
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2" style={{ color: colors.primary }}>
            Scroll to explore
          </span>
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: colors.primary }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </motion.div>
    </section>
  );
};



const features = [
  {
    title: 'Universal Price Comparison',
    desc: 'Real-time comparison across all major platforms including UrbanClap and NoBroker',
    icon: CurrencyDollarIcon,
    bg: 'bg-white text-gray-800',
    delay: 0.1
  },
  {
    title: 'AI Recommendations',
    desc: 'Smart suggestions tailored to your budget and service requirements',
    icon: SparklesIcon,
    bg: 'bg-purple-600 text-white',
    delay: 0.2
  },
  {
    title: 'Verified Reviews',
    desc: 'Authentic feedback from real clients with rating validation',
    icon: CheckBadgeIcon,
    bg: 'bg-pink-600 text-white',
    delay: 0.3
  },
  {
    title: 'Cost Calculator',
    desc: 'Accurate pricing estimates for any home service project',
    icon: CalculatorIcon,
    bg: 'bg-white text-gray-800',
    delay: 0.4
  },
];

const FeatureCard = ({ feature }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: feature.delay }}
      className={`${feature.bg} rounded-xl shadow-lg p-6 flex flex-col space-y-4 relative overflow-hidden group`}
    >
      {/* Zig-zag effect */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-current opacity-10 transform rotate-45 origin-center"></div>
      
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
        <feature.icon className={`w-6 h-6 ${feature.bg.includes('bg-white') ? 'text-purple-600' : 'text-white'}`} />
      </div>
      
      <h3 className="font-bold text-lg">{feature.title}</h3>
      <p className="text-sm leading-relaxed">
        {feature.desc}
      </p>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative bg-gradient-to-b from-[#2a2a6a] to-[#1f1f3d] overflow-hidden py-20 px-4">
      {/* Background image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          alt="Modern home interior"
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        />
      </motion.div>
      
      {/* Animated dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="md:col-span-5 lg:col-span-6 flex flex-col space-y-6 text-white"
        >
          <h2 className="font-extrabold text-3xl sm:text-4xl leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Tools
            </span> for Smarter Home Services
          </h2>
          <p className="text-gray-300 text-lg">
            Our platform combines AI technology with comprehensive market data to help you make the best service decisions.
          </p>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all">
              Explore All Features
            </button>
          </motion.div>
        </motion.div>

        {/* Right Cards */}
        <div className="md:col-span-7 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`${idx % 3 === 0 ? 'transform -translate-y-4' : ''} ${idx % 2 === 0 ? 'md:transform md:translate-y-8' : ''}`}
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const serviceModels = [
  {
    title: 'Traditional Booking',
    desc: 'Compare and book services manually through our platform',
    icon: '📱',
    color: 'from-blue-400 to-blue-600',
    features: [
      'WhatsApp booking support',
      'Transparent pricing',
      'Service tracking',
      'Multiple payment options'
    ]
  },
  {
    title: 'AI Smart Selection',
    desc: 'Our AI compares prices across competitors for best value',
    icon: '🤖',
    color: 'from-purple-500 to-indigo-600',
    features: [
      'Price comparison (vs UrbanClap, NoBroker etc)',
      'Optimized cost-value selection',
      'Extended warranty options',
      'Service tracking dashboard'
    ],
    popular: true
  },
  {
    title: 'Subscription Plans',
    desc: 'Pay once for multiple services with fixed visits',
    icon: '🔄',
    color: 'from-green-500 to-teal-600',
    features: [
      'Monthly/Yearly packages',
      'Fixed number of visits',
      'All services included',
      'Priority service tracking'
    ]
  }
];

const pricingPlans = [
  {
    name: 'Single Service',
    price: '₹300',
    period: '/one-time',
    features: [
      '1 service visit',
      'Basic support',
      'Service tracking',
      'Standard warranty'
    ],
    color: 'from-gray-400 to-gray-500'
  },
  {
    name: 'Extended Warranty',
    price: '₹500',
    period: '/multi-visit',
    features: [
      '3 service visits',
      'Extended warranty',
      'Priority support',
      'Advanced tracking',
      'Price match guarantee'
    ],
    popular: true,
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Unlimited Plan',
    price: '₹1500',
    period: '/month',
    features: [
      'Unlimited services',
      '24/7 premium support',
      'Full warranty coverage',
      'Real-time tracking',
      'AI price comparison',
      'Dedicated manager'
    ],
    color: 'from-purple-500 to-indigo-600'
  }
];

const ServiceModels = () => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-20 mix-blend-multiply"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20 mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Service Models Section */}
        <motion.div
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.div variants={cardVariants}>
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Service Options
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Service Model</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible approaches to get the best service at the best price
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {serviceModels.map((model, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                model.popular ? 'scale-105 z-10 border-2 border-purple-200' : 'border border-gray-100'
              }`}
            >
              {model.popular && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-bold rounded-full shadow-md"
                >
                  Most Popular
                </motion.div>
              )}
              
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 * idx }}
                  className={`w-20 h-20 rounded-2xl mb-6 bg-gradient-to-r ${model.color} text-white text-3xl flex items-center justify-center shadow-lg`}
                >
                  {model.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{model.title}</h3>
                <p className="text-gray-600 mb-5">{model.desc}</p>
                
                <ul className="space-y-3 mb-8">
                  {model.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i + 0.2 * idx }}
                      className="flex items-start"
                    >
                      <svg className={`w-5 h-5 mt-0.5 mr-2 flex-shrink-0 text-${model.color.split(' ')[0].split('-')[1]}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                  model.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {model.popular ? 'Get Started' : 'Learn More'}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-32"
        >
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Pricing Plans
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Pay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Your Way</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose between one-time payments or cost-saving subscription plans
            </p>
          </div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan, idx) => (
              <motion.div 
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'scale-105 z-10 border-2 border-blue-200' : 'border border-gray-100'
                }`}
              >
                {plan.popular && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-md"
                  >
                    Best Value
                  </motion.div>
                )}
                
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-1 ${
                    plan.popular ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  
                  <div className={`w-full h-1 mb-6 bg-gradient-to-r ${plan.color} rounded-full`}></div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i + 0.2 * idx }}
                        className="flex items-start"
                      >
                        <svg className={`w-5 h-5 mt-0.5 mr-2 flex-shrink-0 ${
                          plan.popular ? 'text-blue-500' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Choose Plan
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Process Section */}
        <div className="relative mt-20 rounded-3xl overflow-hidden shadow-inner">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2232&auto=format&fit=crop" 
              alt="Service process background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">Seamless Service Process</h3>
              <p className="text-gray-200 max-w-2xl mx-auto">
                From booking to completion, we ensure complete transparency and tracking
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/20 text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800">1. WhatsApp Booking</h4>
                <p className="text-gray-600">Book via WhatsApp or our platform</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-blue-100/30 text-center relative -translate-y-4 hover:scale-105 transition-transform">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                  Live Tracking
                </div>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800">2. Real-time Tracking</h4>
                <p className="text-gray-600">Monitor service progress in real-time</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/20 text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800">3. Completion & Rating</h4>
                <p className="text-gray-600">Verify service and provide feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};