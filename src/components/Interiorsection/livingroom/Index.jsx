import React, { useState } from 'react';
import Card from '../Cards/Cards';
import StepCarousel from '../../StepCarousel';
import LivingRoomDesignersPage from './LivingRoomDesigners';
import FreelancersSection from '../../freelancers/FreelancersSection';

const cardData = [
  {
    image: 'https://super.homelane.com/other%20interiors/168120391788650f80c5a73bc-HLKT00000826_batch-3-800x600_24-main.jpg',
    hoverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60',
    text: 'Modern Oasis Living Room Design',
  },
  {
    image: 'https://super.homelane.com/other%20interiors/16806849858178d361e94e031-HLKT00000795_living-room-800x600_4-main.jpg',
    hoverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop&q=60',
    text: 'Contemporary and Bright Living Room Design',
  },
  {
    image: 'https://super.homelane.com/other%20interiors/16364324986456a596bb2b958-HLKT00000761_resize-800x600_2-main.jpg',
    hoverImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=60',
    text: 'A Tinge of Earth Living Room',
  },
  {
    image: 'https://super.homelane.com/other%20interiors/1680685063047f4e8a4ce5614-HLKT00000796_living-room-800x600_10-main.jpg',
    hoverImage: 'https://images.unsplash.com/photo-1600566752225-537e566f0322?w=800&auto=format&fit=crop&q=60',
    text: 'Brilliantly White Living Room Design',
  },
  {
    image: 'https://media.architecturaldigest.com/photos/560c37dd7da26e3235ad995e/master/pass/gray-living-room-01.jpg',
    hoverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60',
    text: 'Inspiring Grey Living Room Ideas',
  },
  {
    image: 'https://dropinblog.net/cdn-cgi/image/fit=scale-down,width=700/34246798/files/featured/Modern_Living_Room_Wall_Decoration.jpg',
    hoverImage: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&auto=format&fit=crop&q=60',
    text: 'Modern Living Room Wall Decoration',
  },
];

const LivingRoom = () => {
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
      {/* Hero Section with Form */}
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
              Living Room Design Ideas
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
<FreelancersSection heading='Check Top Freelancers for Living Room  designer'/>    </>
  );
};

export default LivingRoom;