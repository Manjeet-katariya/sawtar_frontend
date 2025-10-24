import React from "react";
import {
  FaUserFriends,
  FaRobot,
  FaCogs,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import banner from "../../assets/img/transectionbanner.png";

const SecureOptionsSection = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const features = [
    {
      icon: <FaLock className="text-2xl text-black" />,
      title: "Blockchain Escrow",
      description: "Secure transactions powered by blockchain technology.",
    },
    {
      icon: <FaRobot className="text-2xl text-black" />,
      title: "AI-Verified Reviews",
      description: "Genuine feedback verified by AI algorithms.",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-black" />,
      title: "Live Service Tracking",
      description: "Real-time updates for your service progress.",
    },
  ];

  const options = [
    {
      icon: <FaUserFriends className="text-3xl text-[#d97706]" />,
      title: "Traditional Aggregator",
      subtitle: "Secure payment via platform",
      description:
        "Manually compare providers like UrbanClap or NoBroker based on price and reviews. Payment is processed through your platform.",
    },
    {
      icon: <FaRobot className="text-3xl text-[#d97706]" />,
      title: "AI-Driven Auto Selection",
      subtitle: "Fix-It Subscription: ₹299–₹999/month",
      description:
        "Let AI choose the best provider based on speed, quality, and pricing. Book instantly via app or WhatsApp chatbot.",
    },
    {
      icon: <FaCogs className="text-3xl text-[#d97706]" />,
      title: "Hire Freelancers",
      subtitle: "Affordable & flexible booking",
      description:
        "Book skilled freelancers directly at lower rates. All providers have verified reviews and service ratings.",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative w-full max-w-9xl mx-auto h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-4">
          <p className="uppercase tracking-widest text-sm mb-2">
            Find Inspiration
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Smart, Secure Payment System for Freelancer Transactions
          </h1>
          <button className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Explore
          </button>
        </div>
      </div>

      {/* Feature Row */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 bg-gray-100 divide-x divide-gray-200 rounded-lg overflow-hidden text-sm mt-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="py-6 px-4 flex items-start gap-4 hover:bg-white cursor-pointer transition-transform duration-300 transform hover:scale-105"
            data-aos="fade-up"
          >
            <div>{feature.icon}</div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">
                {feature.title}
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Section Heading */}
      <div className="text-center my-12 px-4">
        <h2 className="text-3xl font-bold text-slate-800">
          Our Plans to Explore Our Services
        </h2>
        <p className="text-slate-500 mt-2">
          Choose the best way to experience our offerings with flexible options.
        </p>
      </div>

      {/* Options Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {options.map((item, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className={`relative overflow-hidden flex flex-col items-center justify-start text-center px-6 py-10 transition duration-300 transform group cursor-pointer shadow-md
              ${index === 1 ? "md:scale-105 z-10 bg-blue-200" : "md:scale-95 bg-gray-100"}
              group-hover:bg-black/60
            `}
          >
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/60 transition-all duration-300 z-0 "></div>

            {/* Icon */}
            <div className="flex items-center justify-center bg-white rounded-full shadow-md p-4 z-10 -mt-8">
              {item.icon}
            </div>

            {/* Content */}
            <div className="relative z-10 mt-14 text-slate-700 group-hover:text-white transition-all duration-300">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm mt-1 font-medium">{item.subtitle}</p>
              <p className="text-sm mt-2">{item.description}</p>

              {/* Purchase Button */}
              <button className="mt-4 px-5 py-2 bg-[#d97706] text-white rounded-full text-sm hover:bg-[#b45309] transition-all duration-300">
                Purchase Now
              </button>
            </div>

            {/* Date */}
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecureOptionsSection;
