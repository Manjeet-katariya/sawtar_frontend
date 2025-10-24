import React, { useEffect, useState } from 'react';
import {
  FaShoppingBag,
  FaHeart,
  FaTimes,
  FaChevronRight,
  FaMapMarkerAlt,
  FaShippingFast,
  FaTicketAlt,
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaShieldAlt,
  FaCreditCard,
  FaTruck
} from 'react-icons/fa';
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../manageApi/context/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';

// Constants for hardcoded values (ideally fetched from backend or config)
const SHIPPING_COST = 499;
const DISCOUNT_MULTIPLIER = 1.67; // 40% discount

const CartPage = () => {
  const { cart, loading, updateCartItem, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const steps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]);

  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));
    const success = await updateCartItem(itemId, newQuantity);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });

    return success;
  };

  const handleRemoveItem = async (itemId, productType) => {
    console.log(itemId,productType)
    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const success = await removeFromCart(itemId, productType);

    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (loading && !cart) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26a2c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <FaShoppingBag className="text-6xl text-gray-300 mb-6 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Looks like you haven't added any products to your cart yet.
          </p>
          <button
            onClick={() => navigate('/sawtar/ecommerce')}
            className="bg-[#e26a2c] text-white px-8 py-3 rounded-lg hover:bg-[#c75a23] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
            aria-label="Start shopping"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  const calculateSavings = (item) => {
    const originalPrice = item.price_per_unit * DISCOUNT_MULTIPLIER;
    return (originalPrice - item.price_per_unit) * item.quantity;
  };

  const totalSavings = cart.items.reduce((sum, item) => sum + calculateSavings(item), 0);
  const subtotal = cart.total_amount;
  const total = subtotal + SHIPPING_COST;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Stepper */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/sawtar/ecommerce')}
              className="flex items-center text-gray-600 hover:text-[#e26a2c] transition-colors"
              aria-label="Continue shopping"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>

          {/* MUI Stepper */}
          <Box sx={{ width: '100%', mb: 6 }}>
            <Stepper activeStep={0} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Cart Summary Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'} in Cart
                </h2>
                <p className="text-gray-600">Review your items and proceed to checkout</p>
              </div>
              <Chip
                label={`Total: ₹${total.toLocaleString('en-IN')}`}
                color="primary"
                variant="outlined"
                sx={{ fontSize: '1rem', padding: '1rem' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Location Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                    <p className="text-gray-600">Bangalore, Karnataka - 560001</p>
                  </div>
                </div>
                <button
                  className="text-[#e26a2c] font-medium hover:underline px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                  aria-label="Change delivery address"
                >
                  Change
                </button>
              </div>
            </motion.div>

            {/* Cart Items */}
            <AnimatePresence>
              {cart.items.map((item, index) => {
                const product = item.product;
                const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                const imageUrl = primaryImage ? `http://localhost:5000/${primaryImage.url.replace(/\\/g, '/')}` : '/placeholder-image.jpg';
                const isUpdating = updatingItems.has(item._id);

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Product Image */}
                        <div className="md:col-span-3">
                          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                            />
                            {item.quantity > 1 && (
                              <div className="absolute top-2 right-2 bg-[#e26a2c] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {item.quantity}
                              </div>
                            )}
                            
                          </div>
                          <span></span>
                        </div>

                        {/* Product Details */}
                        <div className="md:col-span-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>

                          <div className="flex items-center space-x-4 mb-4">
                            <Chip
                              label={item.product_type}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                            <div className="flex items-center text-yellow-500">
                              <span className="text-sm font-medium">4.5</span>
                              <FaStar className="h-3 w-3 ml-1" />
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <FaMinus className="h-3 w-3" />
                              </button>
                              <span className="px-4 py-2 border-x border-gray-300 font-medium min-w-[3rem] text-center">
                                {isUpdating ? '...' : item.quantity}
                              </span>
                              <button
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                                disabled={isUpdating}
                                aria-label="Increase quantity"
                              >
                                <FaPlus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="flex space-x-3">
                              <button
                                className="text-red-600 hover:text-red-700 flex items-center space-x-2 text-sm transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.product._id, item.product_type)}
                                disabled={isUpdating}
                                aria-label="Remove item from cart"
                              >
                                {isUpdating ? (
                                  <CircularProgress size={12} />
                                ) : (
                                  <FaTrash className="h-4 w-4" />
                                )}
                                <span>Remove</span>
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-700 flex items-center space-x-1 text-sm transition-colors"
                                aria-label="Save item for later"
                              >
                                <FaHeart className="h-3 w-3" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaShippingFast className="h-4 w-4 mr-2 text-[#e26a2c]" />
                            <span>Delivery by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="md:col-span-3 text-right">
                          <div className="space-y-2">
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{(item.price_per_unit * item.quantity).toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{Math.round(item.price_per_unit * DISCOUNT_MULTIPLIER * item.quantity).toLocaleString('en-IN')}
                            </p>
                            <p className="text-green-600 text-sm font-medium">
                              Save ₹{Math.round(calculateSavings(item)).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-gray-500">₹{item.price_per_unit.toLocaleString('en-IN')} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <FaShieldAlt className="h-6 w-6 text-green-500" />
                <span className="font-medium">Secure checkout · SSL encrypted · 100% Protected</span>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-6 space-y-6"
            >
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{Math.round(totalSavings).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹{SHIPPING_COST.toLocaleString('en-IN')}</span>
                  </div>

                  <Divider />

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/sawtar/ecommerce/checkout')}
                  sx={{
                    backgroundColor: '#e26a2c',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#c75a23',
                    }
                  }}
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </Button>

                <button
                  className="w-full mt-3 border border-[#e26a2c] text-[#e26a2c] py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#e26a2c] hover:text-white transition-all duration-200 font-medium"
                  aria-label="Apply coupon code"
                >
                  <FaTicketAlt />
                  <span>Apply Coupon Code</span>
                </button>
              </div>

              {/* Payment Security */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-semibold mb-3 text-gray-900">Payment Security</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaCreditCard className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">SSL Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaShieldAlt className="h-5 w-5 text-green-500" />
                    <span className="text-sm">100% Payment Protection</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaTruck className="h-5 w-5 text-[#e26a2c]" />
                    <span className="text-sm">Free Returns & Exchange</span>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-800 text-center">
                  Need help? Call us at <strong>1800-123-4567</strong> or{' '}
                  <a href="#" className="underline" aria-label="Chat with support">Chat with us</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;