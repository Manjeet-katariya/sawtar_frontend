import React, { useState } from 'react';
import Card from '../Cards/Cards';
import StepCarousel from '../../StepCarousel';
import FreelancersSection from '../../freelancers/FreelancersSection';

const cardData = [
  {
    image: 'https://wideconcepts.in/wp-content/uploads/2023/02/Hinged-Wardrobe-3.png',
    text: 'Hinged Door Wardrobe Design',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://wideconcepts.in/wp-content/uploads/2023/02/Walkin-Wardrobe-2.png',
    text: 'Walk-in Wardrobe Design',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://img.interiorcompany.com/interior/webproduct/450638608828230068145.png?aio=w-1200;',
    text: 'Sliding Door Wardrobe Design',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://i0.wp.com/koloapp.in/magazine/wp-content/uploads/2022/10/image-218.jpeg?resize=840%2C559&ssl=1',
    text: 'Stunning Wardrobe Design ',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://www.decorpot.com/images/152739515815-stunning-sliding-door-wardrobe-designs-2023-for-your-bedroom.jpg',
    text: 'Transparent Wrdrobe Design',
    buttonLabel: 'Get The Quote',
  },
  {
    image: 'https://lh6.googleusercontent.com/proxy/T_Kv27ppoQow1yo1xbceIbr0oYsCIq67nhW4fS7Q2PwRTl0nBKS5GIJ9vuvRGxJYfMubk4YDvO1cVDBRv9uAKgh5_PxR0U7MP3jiXg',
    text: 'Corner Wardrobe Design ',
    buttonLabel: 'Get The Quote',
  },
];

const Wardrobe = () => {


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
              backgroundImage: "url('https://www.asenseinterior.com/assets/uploads/8e0f2371c9d2d74f4d61d2f3f8a649d0.jpg')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-end pb-16">
          {/* Text Content - Bottom Left */}
          <div className="text-white max-w-2xl mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
              Wardrobe  Design Ideas
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
      </div>
      <div className="flex justify-center mt-6">
  <button className="border border-gray-500 px-8 py-2">Load More</button>
</div>
    </div>

<StepCarousel/>
<FreelancersSection heading='Check Top Freelancers for wardrobe designer'/>
    </>
  );
};

export default Wardrobe;