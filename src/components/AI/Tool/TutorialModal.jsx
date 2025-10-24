import React, { useState } from 'react';
import { FiX, FiPlay, FiHelpCircle } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const TutorialModal = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Getting Started",
      content: "Welcome to our room designer! Learn how to create beautiful spaces with our easy-to-use tools.",
      videoThumbnail: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Adding Products",
      content: "Drag and drop products from the sidebar to arrange them in your room.",
      videoThumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Saving Designs",
      content: "Save your favorite designs and share them with friends or clients.",
      videoThumbnail: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveStep(current)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiHelpCircle className="mr-2 text-indigo-600" /> Design Tool Tutorial
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <Slider {...settings}>
              {steps.map((step, index) => (
                <div key={index} className="px-2">
                  <div className="relative bg-gray-100 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                    <img 
                      src={step.videoThumbnail} 
                      alt={step.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button className="relative z-10 bg-indigo-600 text-white rounded-full p-4 hover:bg-indigo-700 transition shadow-lg">
                      <FiPlay size={24} />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold mt-4 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 mt-2">{step.content}</p>
                </div>
              ))}
            </Slider>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-800">Quick Guide:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Browse products from the right sidebar</li>
              <li>Drag and drop items into your room</li>
              <li>Adjust placement with the controls</li>
              <li>Save your design when you're happy</li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Start Designing
          </button>
        </div>
      </div>
    </div>
  );
};

