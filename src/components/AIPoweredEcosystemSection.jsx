import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';

const AIPoweredEcosystemSection = () => {
  const navigate = useNavigate();

  const handleCalculateNow = () => {
    navigate('/sawtar/quotation');
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side: Content */}
          <div className="lg:w-1/2">
            <div className="flex items-center gap-3 mb-3">
              <FaRobot className="text-orange-500 text-2xl" />
              <span className="uppercase tracking-wide font-semibold text-orange-600">
                AI Powered Cost Estimator
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your Dream Home Is Just One Click Away
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              Get accurate cost estimates powered by AI and visualize your perfect space before spending a rupee.
            </p>

            <div className="space-y-5 mb-10">
              {[
                "Instant cost calculations for your project",
                "3D visualization of your future space",
                "Verified professionals at your service",
                "Multiple design styles to match your taste"
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-amber-100 p-1.5 rounded-full mr-4">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCalculateNow}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-2 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group"
            >
              Calculate Now
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Right Side: Image */}
          <div className="lg:w-1/2 relative">
            <div className="bg-white p-2 rounded-xl shadow-2xl border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80" 
                alt="AI Home Design"
                className="w-full h-auto rounded-lg object-cover"
              />
              <div className="absolute -bottom-3 -right-3 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium shadow-xl text-sm">
                AI Estimates from ₹25,000+
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-amber-200/30 blur-3xl"></div>
      <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-orange-200/30 blur-3xl"></div>
    </section>
  );
};

export default AIPoweredEcosystemSection;
