import React from "react";
import { Link } from "react-router-dom";
import kitchen from '../../assets/img/kitchen.png';
import wardrobe from '../../assets/img/wardrobe.png';
import home from '../../assets/img/home.png';

const estimateItems = [
  {
    image: home,
    title: "Full Home",
    description: "Estimate for living room, bedrooms, kitchen, wardrobes & more.",
  },
  {
    image: wardrobe,
    title: "Wardrobe",
    description: "Custom wardrobe design with optimal storage & style.",
  },
  {
    image: kitchen,
    title: "Kitchen",
    description: "Modular kitchen with modern designs & smart solutions.",
  },
];

const EstimateSection = () => {
  return (
    <section className=" py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Get the estimate for your
        </h2>
        <p className="text-xl font-semibold text-blue-600 mb-4">
          Kitchen · Wardrobe · Full Home
        </p>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Calculate the approximate cost of doing up your home interiors. Get started with our easy estimator tool.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {estimateItems.map((item, index) => {
            const linkPath = `/estimate/${item.title.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
            >
            
                <div>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-24 h-24 object-contain mx-auto mb-6 group-hover:scale-105 transition-transform duration-300" 
                  />
                  <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Link to={linkPath}>
                    <button className="px-6 py-2 bg-btn hover:bg-hoverbtn text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
                      Calculate
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EstimateSection;
