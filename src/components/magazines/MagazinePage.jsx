import React, { useState, useEffect } from 'react';

const MagazineSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      title: "Annual Innovation Summit",
      content: "Join us for our Annual Innovation Summit, where industry leaders share insights on the future of technology and design. Network with professionals and explore cutting-edge solutions.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      title: "Community Outreach Program",
      content: "Our Community Outreach Program empowers local communities through workshops and mentorship. Learn how you can contribute to sustainable development initiatives.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      title: "Employee Wellness Workshop",
      content: "Our Employee Wellness Workshop promotes mental and physical health with expert-led sessions on mindfulness, fitness, and work-life balance. Open to all employees!",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      title: "Tech Hackathon 2025",
      content: "Compete in our Tech Hackathon 2025 to solve real-world challenges using AI and design. Win prizes and get noticed by top recruiters in the industry.",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 5,
      title: "Sustainability Conference",
      content: "Explore sustainable practices at our Sustainability Conference. Hear from experts on eco-friendly design and corporate responsibility strategies.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleSlides = () => {
    const slidesCount = slides.length;
    let prev = currentSlide - 1;
    let next = currentSlide + 1;

    if (currentSlide === 0) {
      prev = slidesCount - 1;
    } else if (currentSlide === slidesCount - 1) {
      next = 0;
    }

    return [
      slides[prev],
      slides[currentSlide],
      slides[next]
    ];
  };

  const visibleSlides = getVisibleSlides();
  const currentContent = slides[currentSlide];

  return (
    <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-center text-4xl uppercase mb-4 tracking-wide pb-10 text-gray-800">Our Company Magazines</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Content Panel (1/4 width) */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md flex flex-col justify-center md:col-span-1">
          <h3 className="text-xl font-bold text-gray-600 mb-4">{currentContent.title}</h3>
          <p className="text-gray-700">{currentContent.content}</p>
        </div>

        {/* Slider (3/4 width) */}
        <div className="relative h-[400px] overflow-hidden md:col-span-3">
          <div className="relative h-full flex items-center justify-center">
            {visibleSlides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute transition-all duration-700 ease-in-out ${index === 1 ? 'z-10' : 'z-0'}`}
                style={{
                  width: index === 1 ? '80%' : '30%',
                  left: index === 0 ? '0%' : index === 1 ? '50%' : '80%',
                  transform: index === 1 ? 'translateX(-50%)' : 'none',
                  opacity: index === 1 ? 1 : 0.5,
                }}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                />
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>


    </div>
  );
};

export default MagazineSlider;