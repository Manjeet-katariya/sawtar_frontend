import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ServiceSection() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleCalculateSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate('/marketplace');
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Banner Section */}
      <motion.div
        className="relative bg-gradient-to-r from-[#1A132F] to-[#3A2A5E] text-white py-20 md:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#D26C44] mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-indigo-500 mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform Your Home <br className="hidden md:block" /> With Trusted Professionals
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Connecting you with elite, vetted home service experts for seamless home transformations
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              className="px-8 py-3 bg-white text-indigo-900 rounded-full font-semibold hover:bg-[#D26C44] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => navigate('/sawtar/freelancer')}
            >
              Explore Marketplace
            </button>
            <button
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => setIsModalOpen(true)}
            >
              Get Instant Quote
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Feature Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-60px] mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Verified Professionals',
              description: 'All freelancers undergo rigorous background checks and skill verification to ensure quality and reliability.',
              icon: (
                <div className="relative">
                  <svg className="w-14 h-14 text-white bg-[#D26C44] rounded-2xl p-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ),
            },
            {
              title: 'Transparent Pricing',
              description: 'Know exactly what you\'ll pay with upfront pricing and no hidden fees. Compare quotes easily.',
              icon: (
                <svg className="w-14 h-14 text-white bg-[#1A132F] rounded-2xl p-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: 'Smart Matching',
              description: 'Our AI matches you with the perfect professional based on your specific needs and preferences.',
              icon: (
                <svg className="w-14 h-14 text-white bg-[#3A2A5E] rounded-2xl p-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="mb-5">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

    


      {/* Service Calculator Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Steps */}
              <div className="w-full md:w-1/3 bg-gradient-to-b from-[#1A132F] to-[#3A2A5E] p-6 text-white">
                <h2 className="text-2xl font-bold mb-6">Get Your Custom Quote</h2>
                
                <div className="space-y-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= step ? 'bg-[#D26C44]' : 'bg-white bg-opacity-20'} font-medium`}>
                          {step}
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-lg font-medium ${activeStep >= step ? 'text-white' : 'text-gray-300'}`}>
                          {step === 1 && 'Service Details'}
                          {step === 2 && 'Location Info'}
                          {step === 3 && 'Review & Confirm'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-300">
                          {step === 1 && 'Tell us what you need'}
                          {step === 2 && 'Enter your location'}
                          {step === 3 && 'Get your estimate'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Calculator Preview */}
                <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                  <h4 className="font-medium mb-3">Estimated Cost</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Base Service:</span>
                      <span className="font-medium">$50.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Units:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Location Factor:</span>
                      <span className="font-medium">+15%</span>
                    </div>
                    <div className="border-t border-white border-opacity-20 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total Estimate:</span>
                      <span className="text-[#D26C44]">$115.00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="w-full md:w-2/3 p-6">
                <form onSubmit={handleCalculateSubmit}>
                  {/* Step 1 */}
                  {activeStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Service Details</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">What service do you need?</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all">
                          <option>Select a service</option>
                          <option>AC Repair</option>
                          <option>Home Cleaning</option>
                          <option>Painting</option>
                          <option>Plumbing</option>
                          <option>Electrical</option>
                          <option>Carpentry</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            placeholder="e.g. 2 rooms"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all">
                            <option>Rooms</option>
                            <option>Square Feet</option>
                            <option>Hours</option>
                            <option>Items</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                        <textarea
                          placeholder="Any special requirements?"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all"
                        ></textarea>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 2 */}
                  {activeStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Location Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          placeholder="Street address"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            placeholder="Your city"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            placeholder="ZIP code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-[#D26C44] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3 */}
                  {activeStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Review Your Quote</h3>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-700 mb-3">Service Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">AC Repair Service</span>
                            <span className="font-medium">$50.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">2 Units</span>
                            <span className="font-medium">$100.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location Surcharge</span>
                            <span className="font-medium">+$15.00</span>
                          </div>
                          <div className="border-t border-gray-200 my-2"></div>
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total Estimate</span>
                            <span className="text-[#D26C44]">$115.00</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-700 mb-3">Service Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Service Type</p>
                            <p className="font-medium">AC Repair</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p className="font-medium">2 Units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">New York, NY</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Preferred Date</p>
                            <p className="font-medium">June 15, 2023</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input id="terms-checkbox" type="checkbox" className="w-4 h-4 text-[#D26C44] rounded focus:ring-[#D26C44]" />
                        <label htmlFor="terms-checkbox" className="ml-2 text-sm text-gray-600">
                          I agree to the terms of service and privacy policy
                        </label>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between pt-6">
                    {activeStep > 1 ? (
                      <button
                        type="button"
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        onClick={prevStep}
                      >
                        Back
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                    )}
                    
                    {activeStep < 3 ? (
                      <button
                        type="button"
                        className="px-6 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#b55c3a] font-medium transition-colors"
                        onClick={nextStep}
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#1A132F] text-white rounded-lg hover:bg-[#2a1d45] font-medium transition-colors"
                      >
                        Confirm & Book Now
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          className="bg-gradient-to-r from-[#D26C44] to-[#e07a50] rounded-3xl p-8 md:p-12 text-white overflow-hidden relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white mix-blend-overlay filter blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white mix-blend-overlay filter blur-xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Home?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied homeowners who found their perfect service match with us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              
              <button
                className="relative overflow-hidden px-8 py-3 font-semibold text-white border-2 border-white rounded-full shadow-lg transform transition duration-300 hover:scale-105 group"
                onClick={() => navigate('/sawtar/freelancer/browse-category')}
              >
                <span className="relative z-10">Browse Professionals</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -left-full group-hover:left-full transition-all duration-700"></span>
              </button>
              <button
                className="relative overflow-hidden px-8 py-3 font-semibold text-[#D26C44] bg-white rounded-full shadow-lg transform transition duration-300 hover:scale-105 group"
                onClick={() => navigate('/sawtar/freelancer/registration')}
              >
                <span className="relative z-10">Registration for Freelancers</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 -left-full group-hover:left-full transition-all duration-700"></span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}