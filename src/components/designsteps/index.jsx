import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cog6ToothIcon,
  UserGroupIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";

// Step Data
const steps = [
  {
    label: "Discover",
    description: "Meet with our experts to explore ideas and possibilities.",
    icon: <Cog6ToothIcon className="w-6 h-6" />,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
  },
  {
    label: "Design",
    description: "Collaborate on personalized designs and layouts.",
    icon: <UserGroupIcon className="w-6 h-6" />,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=60",
  },
  {
    label: "Move-in",
    description: "Enjoy hassle-free installation and final walkthrough.",
    icon: <PlayCircleIcon className="w-6 h-6" />,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
  },
];

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-8">
          <motion.h2
            className="text-4xl font-bold leading-snug text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Complete home interiors in{" "}
            <span className="text-btn">3 easy steps</span>
          </motion.h2>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-btn text-white shadow-xl scale-110"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </div>

                  <div>
                    <h4
                      className={`text-lg font-semibold mb-1 ${
                        isActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isActive && (
                      <motion.p
                        key={step.description}
                        className="text-sm text-gray-600"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.button
            className="mt-6 px-6 py-3 bg-btn hover:bg-hoverbtn  text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Free Design Session
          </motion.button>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-72 md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={steps[currentStep].img}
                src={steps[currentStep].img}
                alt={steps[currentStep].label}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
