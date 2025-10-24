import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiEye, FiShoppingCart } from 'react-icons/fi';
import product from "../../assets/img/ecommerce/product.png";

// Sample product data with prices
const furnitureProducts = [
  {
    id: 1,
    name: "Modern Sofa Set",
    description: "Comfortable contemporary sofa with premium fabric",
    image: product,
    price: 899.99,
    isNew: true,
    isPopular: true,
    category: "Living Room"
  },
  {
    id: 2,
    name: "Wooden Dining Table",
    description: "Solid oak dining table with extendable leaves",
    image: product,
    price: 599.99,
    isPopular: true,
    category: "Dining"
  },
  {
    id: 3,
    name: "Leather Armchair",
    description: "Premium leather armchair with ergonomic design",
    image: product,
    price: 349.99,
    isNew: true,
    category: "Living Room"
  },
  {
    id: 4,
    name: "Bookshelf Unit",
    description: "Modular bookshelf with multiple configuration options",
    image: product,
    price: 249.99,
    isPopular: true,
    category: "Office"
  },
  {
    id: 5,
    name: "Linnea Coffee Table",
    description: "Rectangular dark brown wooden coffee table",
    image: product,
    price: 179.99,
    isNew: true,
    category: "Living Room"
  },
  {
    id: 6,
    name: "Rodrigues Bedside Table",
    description: "Wooden bedside table with two drawers",
    image: product,
    price: 129.99,
    isNew: true,
    category: "Bedroom"
  }
];

// Sample categories for the banner
const featuredCategories = [
  {
    name: "Bedroom",
    image: "https://storage.googleapis.com/a1aa/image/29defbb3-df7e-4e6a-7c13-1610cae8a17f.jpg",
    description: "Create your perfect sleep sanctuary",
    link: "/sawtar/ecommerce/filter?category=bedroom"
  },
  {
    name: "Dining Room",
    image: "https://storage.googleapis.com/a1aa/image/6e2b5524-f366-43ba-2712-11e9d5c4863c.jpg",
    description: "Elegant dining experiences",
    link: "/sawtar/ecommerce/filter?category=dining"
  },
  {
    name: "Living Room",
    image: "https://storage.googleapis.com/a1aa/image/985279b1-0ab6-43ea-6133-e443d99c9b11.jpg",
    description: "Stylish furniture for your living space",
    link: "/sawtar/ecommerce/filter?category=living-room"
  }
];

// Custom arrow components for slider
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110"
    >
      <FiChevronRight className="text-gray-800 text-lg" />
    </button>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110"
    >
      <FiChevronLeft className="text-gray-800 text-lg" />
    </button>
  );
};

const ProductItem = ({ product, onViewClick, onAddToCart }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
      <div className="relative flex-grow">
        <div className="h-72 bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#E37B3B] text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            New Arrival
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button
              onClick={() => onViewClick(product)}
              className="bg-white p-3 rounded-full hover:bg-gray-100 transition transform hover:scale-110  flex items-center justify-center"
              title="Quick view"
            >
              <FiEye className="text-gray-800" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-semibold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex space-x-3 mt-auto">
          <button 
            onClick={() => navigate(`/sawtar/ecommerce/product/${product.id}`)}
            className="flex-1 bg-white border border-[#E37B3B] text-[#E37B3B] hover:bg-[#E37B3B]/10 text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center"
          >
            <FiEye className="mr-2" />AR View
          </button>
          <button 
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-[#E37B3B] hover:bg-[#cc6a2f] text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center"
          >
            <FiShoppingCart className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <div className="h-60 bg-gray-100 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-serif font-semibold mb-2 text-gray-800">{category.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
        <button 
          onClick={() => navigate(category.link)}
          className="inline-block bg-[#E37B3B] hover:bg-[#cc6a2f] text-white text-sm font-medium py-2 px-5 rounded transition-colors"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const navigate = useNavigate();

  const popularProducts = furnitureProducts.filter(product => product.isPopular);
  const newArrivals = furnitureProducts.filter(product => product.isNew);

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    // Here you would typically open a modal or navigate to product detail
    navigate(`/sawtar/ecommerce/product/${product.id}`);
  };

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    setShowCartNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-50 relative">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <span>Item added to cart!</span>
          <button 
            onClick={() => setShowCartNotification(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-serif text-2xl md:text-3xl text-gray-800 mb-3">
              Presenting The New <span className="font-semibold text-[#E37B3B]">Sawtar Collection</span>
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Inspired by modern craftsmanship, Sawtar invites you to experience furniture designed with care, warmth, and contemporary elegance.
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12" style={{height:'500px'}}>
            <img 
              alt="Modern living room set" 
              className="w-full h-full object-cover" 
              src="https://storage.googleapis.com/a1aa/image/985279b1-0ab6-43ea-6133-e443d99c9b11.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-8">
              <button 
                onClick={() => navigate('/sawtar/ecommerce/filter')}
                className="bg-[#E37B3B] hover:bg-[#cc6a2f] text-white font-medium py-3 px-8 rounded-full transition-colors"
              >
                Explore the Collection
              </button>
            </div>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredCategories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl text-gray-800 mb-3">New Arrivals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our latest additions to the collection
            </p>
          </div>

          <div className="relative">
            <Slider {...sliderSettings}>
              {newArrivals.map((product) => (
                <div key={product.id} className="px-4">
                  <ProductItem
                    product={product}
                    onViewClick={handleViewClick}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl text-gray-800 mb-3">Popular Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Curated favorites from our customers
            </p>
          </div>

          <div className="relative">
            <Slider {...sliderSettings}>
              {popularProducts.map((product) => (
                <div key={product.id} className="px-4">
                  <ProductItem
                    product={product}
                    onViewClick={handleViewClick}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;