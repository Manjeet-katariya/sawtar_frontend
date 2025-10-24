import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import image  from "../../assets/img/steps/meet.png"

const steps = [
  {
    id: '01',
    title: 'Find The Perfect Component',
    description:
      'Every component is embedded live directly on the page, and you can even see what they look like at different breakpoints by selecting device type.',
    image: image,
  },
  {
    id: '02',
    title: 'Copy The Snippet',
    description:
      'Click the "Code" tab to see the code for a component and grab the part that you need, or click the clipboard button to quickly copy the entire snippet.',
    image: image,
  },
  {
    id: '03',
    title: 'Make It Yours',
    description:
      'Every component is built by framework utility classes with some custom classes if only needed, so you can easily dive in and adjust anything you want to better fit your use case.',
    image: image,
  }, {
    id: '04',
    title: 'Make It Yours',
    description:
      'Every component is built by framework utility classes with some custom classes if only needed, so you can easily dive in and adjust anything you want to better fit your use case.',
    image: image,
  }, {
    id: '05',
    title: 'Make It Yours',
    description:
      'Every component is built by framework utility classes with some custom classes if only needed, so you can easily dive in and adjust anything you want to better fit your use case.',
    image: image,
  },
];

export default function Section2() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (


    
    <div className="bg-gradient-to-r from-pink-100 to-purple-100 min-h-screen py-16 px-6 md:px-20">
      {/* Top Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
        Make It Yours Just In One Click
      </h1>

      {/* Steps and Image */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Section - Steps */}
        <div className="flex gap-8 items-start">
          {/* Circle indicators with gradient background */}
          <div className="flex flex-col items-center p-4 rounded-full bg-gradient-to-b from-black/20 to-transparent gap-25">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-14 h-14 flex items-center justify-center rounded-full border-4 font-bold text-sm transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-black text-white border-black scale-110'
                    : 'bg-white text-gray-400 border-gray-400'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Step text content */}
          <div className="flex flex-col gap-10 mt-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                onMouseEnter={() => setActiveStep(index)}
                className={`transition-all duration-300 cursor-pointer ${
                  activeStep === index ? 'text-black' : 'text-gray-400'
                }`}
              >
                <h3 className="text-2xl font-semibold mb-1">{step.title}</h3>
                <p className="max-w-md text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Image */}
        <motion.div
          key={steps[activeStep].id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[600px] h-[400px] rounded-2xl overflow-hidden p-6"
        >
          <img
            src={steps[activeStep].image}
            alt={steps[activeStep].title}
            className="object-cover w-full h-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
