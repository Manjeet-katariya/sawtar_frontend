import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import stepsvideo from '../../../assets/video/illustrationvideos.mp4';
import introImage from '../../../assets/img/footerbanner.jpg';
import { Link } from "react-router-dom";

const steps = [
  {
    title: 'Select Your Floorplan',
    subtitle: 'Get an interactive 3D home',
    videoUrl: stepsvideo,
    description:
      'Select your floorplan from a library of thousands of homes or upload a floorplan image to get an interactive 3D home.',
  },
  {
    title: 'Design Each Room',
    subtitle: 'Extensive catalog of designs',
    videoUrl: stepsvideo,
    description:
      'Explore over 1000 room designs and personalize them with products from top brands like IKEA and Asian Paints with just a click.',
  },
  {
    title: 'Plan Your Budget',
    subtitle: 'Real-time price estimates',
    videoUrl: stepsvideo,
    description:
      'Get real-time price estimates for the products added to your 3D home, empowering informed decisions and cost savings.',
  },
  {
    title: 'Connect with Experts',
    subtitle: 'Make your design a reality',
    videoUrl: stepsvideo,
    description:
      'Choose from our curated list of reputed professionals with dedicated support from our project advisors.',
  },
];

const FourStepDesign = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-amber-100 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Design Your Dream Home in <span className="text-orange-500">4 Simple Steps</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transform your space with our AI-powered design platform and real-world products.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/sawtar/designs/Tool"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
                >
                  Try It Now <FaArrowRight />
                </Link>
                <button className="border-2 border-gray-800 text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-all">
                  Watch Demo
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-4xl w-full"
            >
              <img src={introImage} alt="Design your dream home" className="w-full rounded-2xl shadow-2xl object-cover max-h-[500px]" />
              <motion.div
                className="absolute -bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg hidden lg:block"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaPlay className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold">See it in action</p>
                    <p className="text-sm text-gray-600">2 min demo</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our <span className="text-orange-500">4-Step</span> Design Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              From concept to reality - a seamless journey to your perfect home
            </p>
          </motion.div>

          <div className="flex overflow-x-auto pb-4 mb-12 scrollbar-hidden justify-center">
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    activeStep === index ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              key={`video-${activeStep}`}
              initial={{ opacity: 0, x: -30, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden shadow-xl aspect-video"
            >
              <video src={steps[activeStep].videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
              <motion.div
                className="absolute inset-0 bg-black/30 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer">
                  <FaPlay className="text-white text-xl" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              key={`text-${activeStep}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
                  {activeStep + 1}
                </div>
                <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider">{steps[activeStep].subtitle}</h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{steps[activeStep].title}</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{steps[activeStep].description}</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all">
                Learn More <FaArrowRight className="text-sm" />
              </button>
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-12">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeStep === index ? 'bg-orange-500 w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FourStepDesign;