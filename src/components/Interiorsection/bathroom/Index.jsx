import React, { useState } from 'react';
import Card from '../Cards/Cards';
import StepCarousel from '../../StepCarousel';
import FreelancersSlider from '../../freelancers/FreelancersSection';

const cardData = [
  {
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824519/pexels-photo-5824519.jpeg',
    text: 'Minimalist Spa-Inspired Bathroom'  },
  {
    image: 'https://images.pexels.com/photos/5824533/pexels-photo-5824533.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824525/pexels-photo-5824525.jpeg',
    text: 'Luxury Marble Master Bath'  },
  {
    image: 'https://images.pexels.com/photos/6312358/pexels-photo-6312358.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824515/pexels-photo-5824515.jpeg',
    text: 'Modern Black & White Bathroom'  },
  {
    image: 'https://images.pexels.com/photos/5824517/pexels-photo-5824517.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824535/pexels-photo-5824535.jpeg',
    text: 'Organic Modern Bath Oasis'  },
  {
    image: 'https://images.pexels.com/photos/5824527/pexels-photo-5824527.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824531/pexels-photo-5824531.jpeg',
    text: 'Industrial Chic Bathroom'  },
  {
    image: 'https://images.pexels.com/photos/5824521/pexels-photo-5824521.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824529/pexels-photo-5824529.jpeg',
    text: 'Scandinavian Wet Room'  },
  {
    image: 'https://images.pexels.com/photos/5824537/pexels-photo-5824537.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824513/pexels-photo-5824513.jpeg',
    text: 'Japanese Soaking Tub Retreat'  },
  {
    image: 'https://images.pexels.com/photos/5824523/pexels-photo-5824523.jpeg',
    hoverImage: 'https://images.pexels.com/photos/5824539/pexels-photo-5824539.jpeg',
    text: 'Vintage Glam Bath Suite'  },
  {
    image: 'https://images.pexels.com/photos/5824519/pexels-photo-5824519.jpeg',
    hoverImage: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    text: 'Smart Technology Bathroom'  }
];

const Bathroom = () => {
    const [visibleCards, setVisibleCards] = useState(3);
    const cardsPerLoad = 3;
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      pincode: '',
      whatsappUpdates: true
    });
    const [pincodeError, setPincodeError] = useState(false);
  
    const handleShowMore = () => {
      setVisibleCards((prev) => Math.min(prev + cardsPerLoad, cardData.length));
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (name === 'pincode') {
        setPincodeError(value.trim() === '');
      }
    };
  
    const toggleWhatsappUpdates = () => {
      setFormData(prev => ({
        ...prev,
        whatsappUpdates: !prev.whatsappUpdates
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (formData.pincode.trim() === '') {
        setPincodeError(true);
        return;
      }
      
      console.log('Form submitted:', formData);
      alert('Thank you for booking a 3D design session! We will contact you soon.');
    };
  return (
    <>
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image with Black Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://dropinblog.net/cdn-cgi/image/fit=scale-down,width=700/34246798/files/featured/Modern_Living_Room_Wall_Decoration.jpg')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-end pb-16">
          {/* Text Content - Bottom Left */}
          <div className="text-white max-w-2xl mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
      Bathroom Design Ideas
            </h1>
            <p className="text-lg md:text-xl font-light max-w-lg">
      Refresh and Renew: Explore smart, elegant, and space-efficient bathroom designs tailored to your lifestyle.
            </p>
          </div>
          
          {/* Meet a Designer Form - Right Side */}
          <div className="absolute right-8 bottom-16 w-full max-w-xs bg-white rounded shadow-xl p-6">
            <h2 className="text-gray-900 text-xl font-normal mb-4">
              Meet a designer
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                aria-label="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 placeholder-gray-400 text-gray-900 text-sm py-2 focus:outline-none focus:border-gray-400"
                placeholder="Enter your name"
                type="text"
                required
              />
              
              <input
                aria-label="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 placeholder-gray-400 text-gray-900 text-sm py-2 focus:outline-none focus:border-gray-400"
                placeholder="Enter your email"
                type="email"
                required
              />
              
              <div className="flex items-center space-x-2">
                <img 
                  alt="Indian flag icon representing country code +91" 
                  className="w-5 h-3" 
                  src="https://storage.googleapis.com/a1aa/image/a55101a0-c985-40af-dc53-ee101f514c68.jpg" 
                />
                <span className="text-sm text-gray-700 select-none">▼</span>
                <input
                  aria-label="Enter your mobile number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 border-b border-gray-300 placeholder-gray-400 text-gray-900 text-sm py-2 focus:outline-none focus:border-gray-400"
                  placeholder="Enter your mobile number"
                  type="tel"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-900 select-none">
                  Send me updates on WhatsApp
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.whatsappUpdates}
                    onChange={toggleWhatsappUpdates}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 ${formData.whatsappUpdates ? 'bg-[#D26C44]' : 'bg-gray-200'} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
              
              <input
                aria-label="Enter your current residence pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 placeholder-gray-400 text-gray-900 text-sm py-2 focus:outline-none focus:border-gray-400"
                placeholder="Enter your current residence pincode"
                type="text"
                required
              />
              {pincodeError && (
                <p className="text-xs text-red-600">
                  Please enter pincode.
                </p>
              )}
              
              <button
                type="submit"
                className="w-full bg-[#D26C44] text-white font-semibold text-sm py-3 rounded flex items-center justify-center gap-2"
              >
                Book 3D Design Session
                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                  FREE
                </span>
              </button>
              
              <p className="text-xs text-gray-700 leading-tight">
                By submitting, you agree to our
                <a className="text-red-600 underline mx-1" href="#">
                  privacy policy
                </a>
                and
                <a className="text-red-600 underline mx-1" href="#">
                  terms of use
                </a>
                , allowing us to use your information as outlined.
              </p>
            </form>
          </div>
        </div>
      </div>


    <div className="w-full py-16 bg-white flex flex-col items-center text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Find inspiration
      </h2>

      {/* Content */}
      <p className="text-gray-600 max-w-2xl mb-6">
       Are you looking for small bathroom design ideas? Let us inspire you! Villeroy & Boch offers a diverse portfolio of high-quality bathroom furniture, washstands, washbasins and toilets, as well as space-saving baths and shower trays with coordinating taps.

      </p>

     </div>


   




    <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Bath-Room Designs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <Card
              key={index}
              image={card.image}
              hoverImage={card.hoverImage}
              text={card.text}
            />
          ))}
        </div>
<div className="flex justify-center mt-6">
  <button className="border border-gray-500 px-8 py-2">Load More</button>
</div>
      </div>
    </div>
        <StepCarousel/>
        <FreelancersSlider heading='Check Top Freelancers for Interior designer'/>
        </>
  );
};

export default Bathroom;