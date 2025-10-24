import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import gsap from "gsap";
import homeimage from "../../assets/img/homepageimage2-min.png";

const featureCards = [
  {
    id: 1,
    title: "AI-Based Interior Design Planner",
    description:
      "Create your dream home with our AI-powered interior design tool. Personalized suggestions, styling tips, and layout planning.",
    subtext: "Smart, intuitive, and stylish.",
    image: "https://img.icons8.com/ios-filled/100/ffffff/artificial-intelligence.png",
    buttonText: "Start Designing",
    link: "/sawtar/designs",
  },
  {
    id: 2,
    title: "Freelancer & Service Marketplace",
    description:
      "Find top designers, architects, and service providers. Hire professionals for any project, big or small.",
    subtext: "Connect with the best in the industry.",
    image: "https://img.icons8.com/ios-filled/100/ffffff/artificial-intelligence.png",
    buttonText: "Explore Marketplace",
    link: "/sawtar/freelancer",
  },
  {
    id: 3,
    title: "Interior Product E-commerce Store",
    description:
      "Shop home décor, furniture, and accessories from trusted brands. Quick delivery and quality guaranteed.",
    subtext: "Shop now, style your space.",
    image: "https://img.icons8.com/ios/100/ffffff/shopping-cart--v1.png",
    buttonText: "Start Shopping",
    link: "/sawtar/ecommerce/home",
  },
  {
    id: 4,
    title: "Community-driven Social Media for Design Enthusiasts",
    description:
      "Share your designs, get inspired, and connect with others in the design community. Join the conversation today.",
    subtext: "Inspire, share, and connect.",
    image: "https://img.icons8.com/ios-filled/100/ffffff/group-background-selected.png",
    buttonText: "Join Now",
    link: "/sawtar/social",
  },
];

const HeroSection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const cardRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, [currentCard]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % featureCards.length);
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + featureCards.length) % featureCards.length);
  };

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % featureCards.length);
  };

  return (
    <div
      className="relative w-full h-screen text-white overflow-hidden"
      style={{
        backgroundImage: `url(${homeimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content Container */}
      <div className="relative z-10 h-full w-full grid grid-cols-1 lg:grid-cols-2 items-center px-4 sm:px-8 lg:px-20 pt-20 sm:pt-24 gap-10">
        {/* Left Content */}
        <div className="max-w-2xl mx-auto lg:mx-0 p-4 sm:p-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Transform Your <br /> Home with Innovation
          </h1>

          <p className="text-lg sm:text-xl font-medium mb-4">
            2025's Interior Design Revolution
            <span className="block w-32 sm:w-44 h-1 bg-gradient-to-r from-[#e6a272] to-transparent mt-2"></span>
          </p>

          <p className="text-base sm:text-lg max-w-xl opacity-90 mb-6">
            From 3D visualizations to shopping your favorite styles and even joining our social design network – we have it all.
          </p>
        </div>

        {/* Right Feature Card */}
        <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] relative flex items-center">
          {/* Prev Arrow - Outside Card */}
          <button
            onClick={handlePrev}
            className="absolute left-0 z-20 p-4 bg-white/40 hover:bg-white/60 rounded-full text-white focus:outline-none transition-all -translate-x-1/2"
            aria-label="Previous card"
          >
            <IoIosArrowBack size={24} />
          </button>

          {/* Card */}
          <div
            ref={cardRef}
            key={featureCards[currentCard].id}
            className="w-full h-full p-6 sm:p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg flex flex-col justify-between transition-all duration-500"
          >
            <div>
              <img
                src={featureCards[currentCard].image}
                alt={featureCards[currentCard].title}
                className="w-12 h-12 sm:w-16 sm:h-16 mb-4"
              />
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                {featureCards[currentCard].title}
              </h3>
              <p className="text-base sm:text-lg opacity-90 mb-2">
                {featureCards[currentCard].description}
              </p>
              <p className="text-sm italic opacity-70">
                {featureCards[currentCard].subtext}
              </p>
            </div>

            <div className="mt-6">
              <Link
                to={featureCards[currentCard].link}
                className="inline-block bg-white text-black font-semibold px-6 py-2 text-sm sm:text-base rounded-md hover:bg-[#D26C44] hover:text-white transition"
              >
                {featureCards[currentCard].buttonText}
              </Link>
            </div>
          </div>

          {/* Next Arrow - Outside Card */}
          <button
            onClick={handleNext}
            className="absolute right-0 z-20 p-4 bg-white/40 hover:bg-white/60 rounded-full text-white focus:outline-none transition-all translate-x-1/2"
            aria-label="Next card"
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
      <div className="absolute bottom-1/3 right-4 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
    </div>
  );
};

export default HeroSection;