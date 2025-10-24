import React, { useState } from 'react';
import Card from '../Cards/Cards';
import StepCarousel from '../../StepCarousel';
import FreelancersSection from '../../freelancers/FreelancersSection';

const cardData = [
  {
    image: 'https://super.homelane.com/Modular%20Kitchens/sleek-superfoam-minimalist-straight-kitchen-industrial-accents-2.webp',
    text: 'Modular Kitchen Design with Stylish Cabinets and Sleek Appliances',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://super.homelane.com/Modular%20Kitchens/white-whisper-modern-island-kitchen-marble-island.webp',
    text: 'White Whisper Modular Island Kitchen',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://super.homelane.com/other%20interiors/16364324986456a596bb2b958-HLKT00000761_resize-800x600_2-main.jpg',
    text: 'A Tinge of Earth Living Room',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://super.homelane.com/Modular%20Kitchens/chamoisee-modern-kitchen-wood-white-cabinets.webp',
    text: 'Chamoisee L-Shaped Modular Kitchen',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://radonindia.com/cdn/shop/files/112117123_1512x.jpg?v=1694426525',
    text: 'Parallel Modular Kitchen Design',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://i.pinimg.com/736x/eb/0c/23/eb0c23bf3f195214da6998236bfb3ed8.jpg',
    text: 'Kitchen Design With Open And Closed Storage Units',
    buttonLabel: 'Get The Quote',
  },
];

const Kitchen = () => {
  const [visibleCards, setVisibleCards] = useState(3); // Show 3 cards initially
  const cardsPerLoad = 3;

  const labels = ['All', 'L-Shaped', 'Straight', 'U-Shaped'];

  const [formData, setFormData] = useState({
     name: '',
     email: '',
     phone: '',
     pincode: '',
     whatsappUpdates: true
   });
   const [pincodeError, setPincodeError] = useState(false);
 
  
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
              Kitchen Design Ideas
            </h1>
            <p className="text-lg md:text-xl font-light max-w-lg">
              Embrace Simplicity: From compact elegance to spacious luxury, discover designs that reflect your style.
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

      {/* Centered Description Section */}
      <div className="w-full py-16 bg-white flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Elevate Your Kitchen with Style
        </h2>
        <p className="text-gray-600 max-w-2xl mb-6">
          Searching for your ideal modular kitchen? Discover stylish, functional kitchen designs with expertly crafted modular solutions.
          Whether you prefer sleek minimalism or a vibrant family hub, our personalized kitchen layouts are designed to enhance your lifestyle and elevate your space.
          From intelligent storage solutions to premium finishes, we blend beauty with practicality to bring your dream kitchen to life.
          Browse our latest modular kitchen collections and find the one that feels like home!
        </p>
        <hr className="w-32 border-t-2 border-gray-300" />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 py-4">
        {labels.map((label, index) => (
          <button
            key={index}
            className="px-5 py-2 border border-red-500 text-red-500 rounded-md font-medium hover:bg-red-500 hover:text-white transition duration-300"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Living Room Designs</h2>
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
<FreelancersSection heading='Check Top Freelancers for Modular kitchen designer'/>
    </>
  );
};

export default Kitchen;