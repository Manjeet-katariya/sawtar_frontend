import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart, FaShoppingCart, FaExternalLinkAlt, FaStar, FaPlus, FaMinus, FaCube } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiArrowDown, FiArrowUp, FiAlertCircle } from 'react-icons/fi';
import { FaShoppingBag } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductAndSimilar } from '../../manageApi/store/productsSlice'; // Adjust path as needed
import { useCart } from '../../manageApi/context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const { currentProduct, similarProducts, loading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showARModal, setShowARModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const baseURL = 'http://localhost:5000/';

  useEffect(() => {
    if (id) {
      dispatch(fetchProductAndSimilar(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct && currentProduct.color_variants) {
      setSelectedVariant(0); // Reset to first variant
      setActiveImageIndex(0); // Reset to first image
    }
  }, [currentProduct]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading product details...</div>;
  }

  if (!currentProduct) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  const currentImages = currentProduct.color_variants[selectedVariant]?.images || [];
  const price = currentProduct.pricing?.sale_price || 0;
  const originalPrice = currentProduct.pricing?.mrp || 0;
  const discountPercentage = currentProduct.pricing?.discount?.percentage || 0;
  const dimensions = `${currentProduct.shipping?.dimensions?.length || ''}"W x ${currentProduct.shipping?.dimensions?.width || ''}"D x ${currentProduct.shipping?.dimensions?.height || ''}"H`;
  const material = currentProduct.material?.name || 'Unknown';
  const style = currentProduct.tags?.[0]?.name || 'default';
  const description = currentProduct.description || '';
  const designerNote = currentProduct.short_description || '';
  const isNew = new Date(currentProduct.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const rentAvailable = currentProduct.rent_available || false;

  const handleAddToCart = async () => {
    await addToCart(currentProduct._id, 'ProductB2C', quantity);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleARView = (prod) => {
    setShowARModal(true);
    alert(`Opening AR view for ${prod.name}`); // Replace with actual AR logic
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl bg-white rounded-xl shadow-lg">
      {/* Main Product Details */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image Section - Sticky on Desktop */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-row gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {currentImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url.startsWith('http') ? image.url : `${baseURL}${image.url.replace(/\\/g, '/')}`}
                  alt={image.alt_text || currentProduct.name}
                  className={`w-16 h-16 object-cover   border ${activeImageIndex === index ? 'border-2 border-[#D26C44]' : 'border-gray-200'} cursor-pointer hover:border-[#D26C44] hover:shadow-md transition-all duration-200 shadow-sm`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="relative flex-1 w-full max-w-[400px] aspect-[4/3] bg-gray-50 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                src={currentImages[activeImageIndex]?.url.startsWith('http') ? currentImages[activeImageIndex].url : `${baseURL}${currentImages[activeImageIndex].url.replace(/\\/g, '/')}`}
                alt={currentImages[activeImageIndex]?.alt_text || currentProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                aria-label="Previous image"
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 text-gray-800 p-2.5 rounded-full shadow-lg hover:bg-white hover:text-[#D26C44] transition-all duration-200"
                onClick={handlePrevImage}
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next image"
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 text-gray-800 p-2.5 rounded-full shadow-lg hover:bg-white hover:text-[#D26C44] transition-all duration-200"
                onClick={handleNextImage}
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
              {rentAvailable && (
                <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-teal-600 px-2.5 py-1 text-xs font-medium text-white shadow-md">
                  Rent Available
                </span>
              )}
              {isNew && (
                <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white shadow-md">
                  New Arrival
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Info - Scrolls Independently */}
        <div className="flex-1 ">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentProduct.name}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((rating) => (
                <FaStar
                  key={rating}
                  className={`h-5 w-5 ${4.5 > rating ? 'text-amber-400' : 'text-gray-300'}`} // Default rating of 4.5 as per API
                  fill={4.5 > rating ? 'currentColor' : 'none'}
                />
              ))}
              <span className="text-sm text-gray-600">(128 reviews)</span> {/* Default value */}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <button
                aria-label="Share product"
                className="hover:text-[#D26C44] transition-colors duration-200"
                onClick={() => alert('Share functionality to be implemented')}
              >
                <FaShareAlt className="h-5 w-5" />
              </button>
              <button
                aria-label="Add to wishlist"
                className="hover:text-red-600 transition-colors duration-200"
                onClick={() => alert('Wishlist functionality to be implemented')}
              >
                <FaHeart className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Color Variants */}
          <div className="mb-4">
            <div className="flex gap-3">
              {currentProduct.color_variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(index)}
                  className={`w-16 h-10 rounded-lg overflow-hidden border ${selectedVariant === index ? 'border-2 border-[#D26C44] shadow-md' : 'border-gray-200'} hover:border-[#D26C44] hover:shadow-md transition-all duration-200`}
                >
                  <img
                    src={variant.images.find((img) => img.is_primary)?.url.startsWith('http') ? variant.images.find((img) => img.is_primary).url : `${baseURL}${variant.images.find((img) => img.is_primary).url.replace(/\\/g, '/')}`}
                    alt={variant.color_name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900">₹ {price.toLocaleString('en-IN')} <span className="text-sm text-gray-500 line-through">MRP ₹{originalPrice.toLocaleString('en-IN')}</span> ({discountPercentage}% OFF)</p>
            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* EMI and Offers */}
          <div className="mb-6 bg-orange-50 p-4 rounded-lg flex justify-between items-center shadow-sm">
            <div>
              <p className="font-medium text-gray-800">No Cost EMI starting from ₹{Math.round(price / 30).toLocaleString('en-IN')}/Month</p>
              <button className="text-blue-600 text-sm hover:underline">View plans</button>
            </div>
            <div>
              <p className="font-medium text-gray-800">Savings of ₹750 with offers</p>
              <button className="text-blue-600 text-sm hover:underline">View offers</button>
            </div>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center border border-gray-300 rounded-lg w-32 overflow-hidden shadow-sm">
              <button
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                <FaMinus className="h-4 w-4 text-gray-600" />
              </button>
              <input
                className="w-full text-center border-x border-gray-300 py-2 text-gray-800 font-medium"
                type="text"
                value={quantity}
                readOnly
              />
              <button
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                <FaPlus className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              className="bg-[#D26C44] text-white font-medium py-3 rounded-lg hover:bg-[#c45a34] transition-colors shadow-md flex items-center justify-center gap-2"
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              className="border border-[#D26C44] text-[#D26C44] font-medium py-3 rounded-lg hover:bg-[#D26C44]/10 transition-colors flex items-center justify-center gap-2 shadow-sm"
              onClick={() => alert('Buy Now functionality to be implemented')}
            >
              <FaShoppingBag className="h-5 w-5" />
              Buy Now
            </button>
          </div>

          {/* Pincode Checker */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Check Delivery</label>
            <div className="flex gap-2">
              <input
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44] focus:border-transparent transition-all duration-200"
                placeholder="Enter Pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button
                className="bg-[#D26C44] text-white px-6 py-2 rounded-lg hover:bg-[#c45a34] transition-colors shadow-sm"
                onClick={() => alert(`Checking delivery for pincode: ${pincode}`)}
              >
                Check
              </button>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-3">
            <button
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
              onClick={() => toggleSection('overview')}
            >
              <span className="font-medium text-gray-800">Overview</span>
              {expandedSection === 'overview' ? <FaMinus className="text-gray-600" /> : <FaPlus className="text-gray-600" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'overview' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 text-gray-700 overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <p>{description}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
              onClick={() => toggleSection('details')}
            >
              <span className="font-medium text-gray-800">Details & Dimensions</span>
              {expandedSection === 'details' ? <FaMinus className="text-gray-600" /> : <FaPlus className="text-gray-600" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'details' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 text-gray-700 overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-2"><strong>Dimensions:</strong> {dimensions}</p>
                  <p className="mb-2"><strong>Material:</strong> {material}</p>
                  <p className="mb-2"><strong>Style:</strong> {style}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
              onClick={() => toggleSection('care')}
            >
              <span className="font-medium text-gray-800">Care & Maintenance</span>
              {expandedSection === 'care' ? <FaMinus className="text-gray-600" /> : <FaPlus className="text-gray-600" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'care' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 text-gray-700 overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <p>Clean with a soft, dry cloth. Avoid prolonged exposure to direct sunlight to prevent fading. Store in a dry environment.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
              onClick={() => toggleSection('additional')}
            >
              <span className="font-medium text-gray-800">Additional Info</span>
              {expandedSection === 'additional' ? <FaMinus className="text-gray-600" /> : <FaPlus className="text-gray-600" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'additional' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 text-gray-700 overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-2">{designerNote}</p>
                  <p><strong>Rent Available:</strong> {rentAvailable ? 'Yes' : 'No'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Price Comparison Section (Placeholder) */}
      <motion.div
        className="mt-12 bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Price Comparison</h2>
          <div className="flex items-center text-sm text-gray-500 gap-1">
            <FiInfo className="h-4 w-4" />
            Updated {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Our Price</h3>
                <p className="text-sm text-gray-600">Best value guaranteed</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{price.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <p className="text-center text-gray-500 py-4">Price comparison data not available.</p>
      </motion.div>

      {/* Similar Products Section */}
      <motion.div
        className="mt-12 bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarProducts.map((similarProduct) => (
            <motion.div
              key={similarProduct._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={similarProduct.color_variants[0]?.images.find((img) => img.is_primary)?.url.startsWith('http') ? similarProduct.color_variants[0].images.find((img) => img.is_primary).url : `${baseURL}${similarProduct.color_variants[0].images.find((img) => img.is_primary).url.replace(/\\/g, '/')}`}
                  alt={similarProduct.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {similarProduct.rent_available && (
                  <span className="absolute top-3 left-3 bg-teal-600 text-white px-2.5 py-1 text-xs font-medium rounded-full shadow-md">
                    Rent Available
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#D26C44] hover:text-white transition-colors shadow-md"
                    onClick={() => navigate(`/sawtar/ecommerce/product/${similarProduct._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#D26C44] hover:text-white transition-colors shadow-md"
                    onClick={() => handleARView(similarProduct)}
                  >
                    <FaCube className="inline mr-1 h-4 w-4" />
                    AR View
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{similarProduct.name}</h3>
                <p className="text-xl font-bold text-gray-900 mb-2">₹ {similarProduct.pricing.sale_price.toLocaleString('en-IN')}</p>
                <div className="flex items-center mb-2">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <FaStar
                      key={rating}
                      className={`h-4 w-4 ${4.5 > rating ? 'text-amber-400' : 'text-gray-300'}`} // Default rating
                      fill={4.5 > rating ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(128)</span> {/* Default value */}
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    {similarProduct.tags?.[0]?.name || 'default'}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    {similarProduct.material?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {similarProducts.length === 0 && (
            <p className="col-span-3 text-center text-gray-500 py-8">No similar products found</p>
          )}
        </div>
      </motion.div>

      {/* AR Modal */}
      {showARModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">AR View - {currentProduct.name}</h3>
            <p className="text-gray-600 mb-6">Scan the QR code or use your device camera to view in AR.</p>
            <div className="bg-gray-200 h-64 flex items-center justify-center mb-4 rounded-md">
              <p className="text-gray-500">AR Viewer Placeholder</p>
            </div>
            <button
              className="w-full bg-[#D26C44] text-white py-3 rounded-lg hover:bg-[#c45a34] transition-colors shadow-md"
              onClick={() => setShowARModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;