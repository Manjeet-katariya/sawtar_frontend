import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import slideimage from "../assets/img/steps/steps1.png";
import slideimage1 from "../assets/img/slide2.png";
import { FaDraftingCompass, FaPaintBrush, FaPencilRuler, FaTools, FaStar } from "react-icons/fa";

const steps = [
  { 
    before: slideimage, 
    after: slideimage, 
    title: "Initial Consultation", 
    desc: "We discuss your vision and requirements for the space.",
    icon: <FaDraftingCompass />,
    color: "from-blue-500 to-blue-700"
  },
  { 
    before: slideimage1, 
    after: slideimage1, 
    title: "Concept Development", 
    desc: "Our designers create initial concepts for your review.",
    icon: <FaPaintBrush />,
    color: "from-green-500 to-green-700"
  },
  { 
    before: slideimage, 
    after: slideimage, 
    title: "Design Finalization", 
    desc: "You select materials, colors, and finishes.",
    icon: <FaPencilRuler />,
    color: "from-yellow-500 to-yellow-700"
  },
  { 
    before: slideimage1, 
    after: slideimage1, 
    title: "Implementation", 
    desc: "Our team brings the design to life with precision.",
    icon: <FaTools />,
    color: "from-red-500 to-red-700"
  },
  { 
    before: slideimage, 
    after: slideimage, 
    title: "Reveal & Enjoy", 
    desc: "We reveal your beautifully transformed space!",
    icon: <FaStar />,
    color: "from-purple-500 to-purple-700"
  },
];

const StepCarousel = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("next");
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setDirection("prev");
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 500);
  };

  const handleNext = () => {
    setDirection("next");
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToStep = (index) => {
    setDirection(index > currentStep ? "next" : "prev");
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <>
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Heading */}
      
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
          From Design to 
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 ms-2">Move-In</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          A seamless journey from concept to completion
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Step Indicators - Vertical */}
       <div className="lg:w-1/4 relative">
          <div className="hidden lg:flex flex-col h-full">
            <div className="relative h-full ml-6">
              {/* Diamond-shaped progress track */}
              <div className="absolute left-10 top-0 bottom-0 w-1 bg-gray-200 z-0">
                <div 
                  className="w-full bg-gradient-to-b from-blue-500 to-purple-600 transition-all duration-500 ease-in-out" 
                  style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
              
              {/* Diamond-shaped step indicators */}
              <div className="flex flex-col justify-between h-full relative z-10">
                {steps.map((step, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${i === currentStep ? "bg-white shadow-xl -translate-x-2" : "hover:bg-gray-50"}`}
                    onClick={() => goToStep(i)}
                  >
                    {/* Diamond-shaped icon container */}
                    <div className={`relative w-14 h-14 flex items-center justify-center transition-all duration-300 ${i === currentStep ? `bg-gradient-to-br ${step.color} text-white scale-110 shadow-lg` : i < currentStep ? `bg-gradient-to-br ${step.color} text-white` : "bg-gray-100 text-gray-400"}`}
                         style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}>
                      <span className="text-xl">{step.icon}</span>
                      
                      {/* Diamond point connector */}
                      {i < steps.length - 1 && (
                        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${i < currentStep ? `bg-gradient-to-br ${steps[i+1].color}` : "bg-gray-200"}`}></div>
                      )}


                
                    </div>
                    
                    <div className={`transition-all duration-300 ${i === currentStep ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      <p className="text-sm font-medium">{step.title}</p>
                      {i === currentStep && (
                        <p className="text-xs mt-1 text-gray-600">{i + 1} of {steps.length}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
         
        </div>

        {/* Carousel Content */}
        <div className="lg:w-3/4 relative group">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-xl hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hover:shadow-lg hover:scale-110"
            aria-label="Previous step"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <FaChevronLeft className="text-white text-lg" />
            </div>
          </button>

          <div className="relative overflow-hidden justify-center  bg-white">
            <div className="aspect-w-16 aspect-h-9 h-[400px] sm:h-[500px] lg:h-[600px] flex justify-center items-center  relative ">
              <div 
  className="relative w-full h-[500px] " // Set desired height here
>
  <div 
    className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out 
      ${isTransitioning ? (direction === "next" ? 'opacity-0 translate-x-4' : 'opacity-0 -translate-x-4') : 'opacity-100 translate-x-0'}`}
  >
    <img
      src={steps[currentStep].before}
      alt={steps[currentStep].title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
  </div>

 <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-white">
                <div className="max-w-2xl">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 bg-white/20 backdrop-blur-sm">
                    Step {currentStep + 1}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">{steps[currentStep].title}</h3>
                  <p className="text-lg sm:text-xl opacity-90 mb-6">{steps[currentStep].desc}</p>
                  <div className="flex gap-2">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToStep(i)}
                        className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'bg-white w-8' : 'bg-white/50 w-3'}`}
                        aria-label={`Go to step ${i + 1}`}
                      ></button>
                    ))}
                  </div>
                  
                </div>

  

              </div>
</div>

              
             
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-xl hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hover:shadow-lg hover:scale-110"
            aria-label="Next step"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <FaChevronRight className="text-white text-lg" />
            </div>
          </button>
        </div>
     
      </div>

      {/* Mobile Step Indicators */}
      <div className="mt-12 lg:hidden">
        <div className="relative">
          <div className="absolute top-6 left-10 right-10 h-[2px] bg-gray-200 z-0">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-in-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between relative z-10">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => goToStep(i)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${i === currentStep ? `bg-gradient-to-br ${step.color} text-white scale-110 shadow-lg` : i < currentStep ? `bg-gradient-to-br ${step.color} text-white` : "bg-gray-100 text-gray-400"}`}>
                  <span className="text-xl">{step.icon}</span>
                </div>
                <div className={`mt-3 text-center transition-all duration-300 ${i === currentStep ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                  <p className="text-sm font-medium">{step.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
 


    </>
  );
};

export default StepCarousel;