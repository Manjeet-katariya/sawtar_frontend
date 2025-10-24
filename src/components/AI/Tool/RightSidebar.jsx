import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { FiMenu, FiX, FiChevronDown, FiSearch, FiMessageSquare, FiFilter, FiHelpCircle, FiPlay } from 'react-icons/fi';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { IoIosColorPalette } from 'react-icons/io';
import { GiBed, GiOfficeChair, GiSofa, GiDesk, GiCeilingLight } from 'react-icons/gi';
import { Dialog } from '@headlessui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RightSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('beds');
  const [colorFilter, setColorFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const categories = [
    { id: 'beds', name: 'Beds', icon: <GiBed size={20} /> },
    { id: 'chairs', name: 'Chairs', icon: <GiOfficeChair size={20} /> },
    { id: 'sofas', name: 'Sofas', icon: <GiSofa size={20} /> },
    { id: 'tables', name: 'Tables', icon: <GiDesk size={20} /> },
    { id: 'lighting', name: 'Lighting', icon: <GiCeilingLight size={20} /> },
  ];

  const colorOptions = [
    '#3a3a3a', '#f7f7df', '#000000', '#ffffff', '#a82a2a',
    '#3a7bbf', '#f9b3c0', '#6a0000', '#f59e0b', '#fcd34d',
  ];

  const tutorialSteps = [
    {
      id: 1,
      title: "Getting Started",
      content: "Welcome to our room designer! Learn how to create beautiful spaces with our easy-to-use tools.",
      video: "https://example.com/video1.mp4"
    },
    {
      id: 2,
      title: "Adding Products",
      content: "Drag and drop products from the sidebar to arrange them in your room.",
      video: "https://example.com/video2.mp4"
    },
    {
      id: 3,
      title: "Saving Designs",
      content: "Save your favorite designs and share them with friends or clients.",
      video: "https://example.com/video3.mp4"
    }
  ];

  const roomDesigns = [
    {
      id: 1,
      name: 'Modern Minimalist',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'A clean and airy design with neutral tones.',
    },
    {
      id: 2,
      name: 'Cozy Scandinavian',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Warm textures with a Nordic aesthetic.',
    },
    {
      id: 3,
      name: 'Industrial Loft',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Bold and raw with exposed materials.',
    },
    {
      id: 4,
      name: 'Bohemian Chic',
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Eclectic mix of patterns and textures.',
    },
  ];

  useEffect(() => {
    const sampleProducts = [
      {
        id: 1,
        name: 'Modern Wooden Bed',
        brand: 'Wooden Street',
        price: 55349,
        originalPrice: 89699,
        discount: 38,
        category: 'beds',
        colors: ['#3a3a3a', '#6a0000', '#f59e0b'],
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        dimensions: { width: 180, height: 200, depth: 60 },
        description: 'A sleek modern bed with a sturdy wooden frame.',
      },
      {
        id: 2,
        name: 'Contemporary Bed Frame',
        brand: 'Wooden Street',
        price: 23989,
        originalPrice: 38999,
        discount: 38,
        category: 'beds',
        colors: ['#f7f7df', '#a82a2a', '#3a7bbf'],
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        dimensions: { width: 150, height: 190, depth: 55 },
        description: 'Elegant and minimalist bed frame for modern bedrooms.',
      },
      {
        id: 3,
        name: 'Minimalist Wood Bed',
        brand: 'Nilkamal',
        price: 25802,
        category: 'beds',
        colors: ['#f9b3c0', '#6a0000', '#fcd34d'],
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        dimensions: { width: 160, height: 195, depth: 50 },
        description: 'Simple yet stylish wooden bed for small spaces.',
      },
      {
        id: 4,
        name: 'White Slatted Bed',
        brand: 'Denkali',
        price: 32499,
        category: 'beds',
        colors: ['#ffffff', '#f7f7df', '#3a7bbf'],
        image: 'https://images.unsplash.com/photo-1566667380589-1b7b36f1b8a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        dimensions: { width: 170, height: 185, depth: 65 },
        description: 'Bright and airy bed with a slatted design.',
      },
      {
        id: 5,
        name: 'Leather Lounge Chair',
        brand: 'Urban Living',
        price: 18999,
        originalPrice: 24999,
        discount: 24,
        category: 'chairs',
        colors: ['#3a3a3a', '#6a0000', '#a82a2a'],
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        dimensions: { width: 80, height: 90, depth: 85 },
        description: 'Comfortable leather chair for lounging.',
      },
    ];
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts.filter((p) => p.category === 'beds'));
  }, []);

  useEffect(() => {
    let filtered = products.filter((p) => p.category === selectedCategory);
    if (colorFilter) filtered = filtered.filter((p) => p.colors.includes(colorFilter));
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    setFilteredProducts(filtered);
  }, [selectedCategory, colorFilter, priceRange, products]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: 'How about a minimalist design with neutral tones?', sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div
      className={`${sidebarOpen ? 'w-2/5' : 'w-0'} bg-white flex flex-col transition-all duration-300 overflow-hidden shadow-lg relative`}
    >
    

      {sidebarOpen && (
        <>
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <ul className="flex space-x-6">
                <li>
                  <button
                    onClick={() => setActiveTab('designs')}
                    className={`flex items-center space-x-1 text-sm font-medium ${activeTab === 'designs' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 transition`}
                  >
                    <span>Designs</span>
                    <FiChevronDown />
                  </button>
                </li>
                <li className="relative">
                  <button
                    onClick={() => setShowProductDropdown(!showProductDropdown)}
                    className={`flex items-center space-x-1 text-sm font-medium ${activeTab === 'products' ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600 transition`}
                  >
                    <span>Products</span>
                    <FiChevronDown />
                  </button>
                  {showProductDropdown && (
                    <div className="absolute top-8 left-0 bg-white rounded-lg shadow-xl z-30 w-48 py-2 border">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowProductDropdown(false);
                            setActiveTab('products');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center space-x-2 text-sm"
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              </ul>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowTutorial(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <FiHelpCircle className="mr-1" /> Tutorial
                </button>
                <button 
                  onClick={() => setShowOffcanvas(true)}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  <FiMenu size={18} />
                </button>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {activeTab === 'designs' ? (
            <div className="p-4 flex-1 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Room Designs</h2>
              <div className="grid grid-cols-2 gap-4">
                {roomDesigns.map((design) => (
                  <div key={design.id} className="relative group cursor-pointer">
                    <img
                      src={design.image}
                      alt={design.name}
                      className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition"
                    />
                    <div className="mt-2 text-sm font-semibold text-gray-800">{design.name}</div>
                    <p className="text-xs text-gray-500">{design.description}</p>
                    <button className="mt-2 w-full bg-indigo-600 text-white py-1 rounded-lg text-sm hover:bg-indigo-700 transition">
                      Apply Design
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </h2>
                <button className="flex items-center space-x-1 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 transition">
                  <span>Filters</span>
                  <FiFilter />
                </button>
              </div>

              <div className="p-4 border-b">
                <div className="flex items-center space-x-2 mb-3">
                  <IoIosColorPalette className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Colors</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setColorFilter(colorFilter === color ? null : color)}
                      className={`w-7 h-7 rounded-full border-2 flex-shrink-0 ${
                        colorFilter === color ? 'border-indigo-500' : 'border-transparent'
                      } hover:border-indigo-300 transition`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Price Range</span>
                  <span className="text-sm font-medium text-gray-700">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Min</label>
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Max</label>
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full accent-indigo-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 border-b flex space-x-3 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg transition min-w-[80px] ${
                      selectedCategory === category.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-xs mt-1 font-medium">{category.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard 
                      product={product} 
                      toggleFavorite={toggleFavorite} 
                      favorites={favorites} 
                      onViewDetails={() => setSelectedProduct(product)} 
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Offcanvas Menu */}
          {showOffcanvas && (
            <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex justify-end">
              <div className="bg-white w-80 h-full shadow-xl transform transition-transform duration-300 ease-in-out">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Menu</h3>
                  <button onClick={() => setShowOffcanvas(false)}>
                    <FiX size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                        My Designs
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                        Saved Products
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                        Account Settings
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                        Help Center
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setShowOffcanvas(false);
                          setShowTutorial(true);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        View Tutorial
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tutorial Modal */}
          {showTutorial && (
            <Dialog open={showTutorial} onClose={() => setShowTutorial(false)} className="fixed inset-0 z-50 overflow-y-auto">
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title className="text-xl font-bold text-gray-800">Designer Tutorial</Dialog.Title>
                      <button 
                        onClick={() => setShowTutorial(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={24} />
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <Slider {...settings}>
                        {tutorialSteps.map(step => (
                          <div key={step.id} className="px-2">
                            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                              <button className="bg-indigo-600 text-white rounded-full p-4 hover:bg-indigo-700 transition">
                                <FiPlay size={24} />
                              </button>
                            </div>
                            <h3 className="text-lg font-semibold mt-4">{step.title}</h3>
                            <p className="text-gray-600 mt-2">{step.content}</p>
                          </div>
                        ))}
                      </Slider>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">How to use this designer:</h3>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>Browse products from the right sidebar</li>
                        <li>Drag and drop items into your room</li>
                        <li>Adjust placement with the controls</li>
                        <li>Save your design when you're happy</li>
                      </ol>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {[1, 2, 3].map(step => (
                          <button
                            key={step}
                            onClick={() => setActiveStep(step)}
                            className={`w-3 h-3 rounded-full ${activeStep === step ? 'bg-indigo-600' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setShowTutorial(false)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Got it!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog>
          )}

          {/* Chat Button */}
          <button
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-300 z-30"
          >
            <FiMessageSquare size={20} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </button>

          {/* Chat Window */}
          {showChat && (
            <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl z-40 flex flex-col">
              <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
                <h3 className="font-medium text-sm">Design Assistant</h3>
                <button onClick={() => setShowChat(false)} className="text-white">
                  <FiX size={16} />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto max-h-60">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    <p className="text-sm">Ask our AI for design advice!</p>
                    <p className="text-xs mt-1">Try: "Suggest a color scheme for my bedroom"</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block px-3 py-2 rounded-lg max-w-xs text-sm ${
                          msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask about room design..."
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600 transition">
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Modal */}
          {selectedProduct && (
            <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} className="fixed inset-0 z-50 flex items-center justify-center">
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                  <FiX size={20} />
                </button>
                <Dialog.Title className="text-lg font-semibold text-gray-800">{selectedProduct.name}</Dialog.Title>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-lg mt-2" />
                <p className="text-sm text-gray-600 mt-2">{selectedProduct.brand}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedProduct.description}</p>
                <div className="mt-2">
                  <span className="text-sm font-semibold text-indigo-600">₹{selectedProduct.price.toLocaleString()}</span>
                  {selectedProduct.originalPrice && (
                    <span className="ml-2 line-through text-gray-400 text-xs">
                      ₹{selectedProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex mt-2 space-x-2">
                  {selectedProduct.colors.map((color, index) => (
                    <div key={index} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Width: {selectedProduct.dimensions.width} cm</p>
                  <p>Height: {selectedProduct.dimensions.height} cm</p>
                  <p>Depth: {selectedProduct.dimensions.depth} cm</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      toggleFavorite(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center"
                  >
                    {favorites.includes(selectedProduct.id) ? (
                      <>
                        <FaStar className="mr-2 text-yellow-400" /> Saved
                      </>
                    ) : (
                      <>
                        <FaRegStar className="mr-2" /> Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

const ProductCard = ({ product, toggleFavorite, favorites, onViewDetails }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'product',
    item: { product },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`relative group cursor-pointer ${isDragging ? 'opacity-50' : ''}`}>
      {product.discount && (
        <div className="absolute top-2 left-2 bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-1 rounded">
          {product.discount}% off
        </div>
      )}
      <button
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
      >
        {favorites.includes(product.id) ? (
          <FaStar className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-gray-400 hover:text-yellow-400" />
        )}
      </button>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition"
        onClick={onViewDetails}
      />
      <div className="mt-2 text-xs text-gray-500">{product.brand}</div>
      <div className="text-sm font-semibold text-indigo-600">
        ₹{product.price.toLocaleString()}
        {product.originalPrice && (
          <span className="ml-2 line-through text-gray-400 text-xs">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-700 truncate">{product.name}</div>
      <div className="flex mt-1 space-x-1">
        {product.colors.slice(0, 3).map((color, index) => (
          <div key={index} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
        ))}
        {product.colors.length > 3 && <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>}
      </div>
    </div>
  );
};

export default RightSidebar;