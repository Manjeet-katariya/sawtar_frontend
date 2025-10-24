// src/components/EcommerceNavbar.js
import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { FiUser } from "react-icons/fi";  // ✅ Correct package
import { TbEye } from "react-icons/tb";
import { BsTruck } from "react-icons/bs";
import { CiShoppingCart } from "react-icons/ci";

import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AiDesigner from "../ecommerce/AiDesigner";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../manageApi/store/authSlice'; // Adjust path
import { useCart } from '../../manageApi/context/CartContext'; // Adjust path
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import axios from "axios";

const EcommerceNavbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState('left');
  const { cartCount } = useCart(); // Get cart count
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

 

  const locations = [
    "All Locations",
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami"
  ];

  const homeCategories = [
    {
      name: "Living Room",
      subcategories: [
        "Sofas & Couches",
        "Sectionals",
        "Loveseats",
        "Coffee Tables",
        "TV Stands",
        "Entertainment Centers",
        "Bookshelves",
        "Console Tables",
        "Accent Chairs",
        "Recliners"
      ]
    },
    {
      name: "Bedroom",
      subcategories: [
        "Beds",
        "Mattresses",
        "Bed Frames",
        "Wardrobes",
        "Dressers",
        "Nightstands",
        "Armoires",
        "Vanities",
        "Mirrors",
        "Bedroom Sets"
      ]
    },
    {
      name: "Kitchen & Dining",
      subcategories: [
        "Dining Tables",
        "Dining Chairs",
        "Bar Stools",
        "Kitchen Islands",
        "Buffets & Sideboards",
        "China Cabinets",
        "Baker's Racks",
        "Pantry Storage",
        "Counter Stools",
        "Breakfast Nooks"
      ]
    },
    {
      name: "Home Office",
      subcategories: [
        "Desks",
        "Office Chairs",
        "Filing Cabinets",
        "Bookcases",
        "Credenzas",
        "Reading Chairs",
        "Office Sets",
        "Computer Stands",
        "Printer Stands",
        "Whiteboards"
      ]
    },
    {
      name: "Outdoor Furniture",
      subcategories: [
        "Patio Sets",
        "Porch Swings",
        "Outdoor Dining",
        "Adirondack Chairs",
        "Hammocks",
        "Outdoor Sofas",
        "Sun Loungers",
        "Gazebos",
        "Porch Rockers",
        "Patio Bars"
      ]
    },
    {
      name: "Home Decor",
      subcategories: [
        "Rugs",
        "Curtains",
        "Blinds",
        "Wall Art",
        "Mirrors",
        "Throw Pillows",
        "Decorative Accents",
        "Vases",
        "Candles",
        "Clocks"
      ]
    },
    {
      name: "Appliances",
      subcategories: [
        "Ceiling Fans",
        "Stand Fans",
        "Table Fans",
        "Exhaust Fans",
        "Air Purifiers",
        "Humidifiers",
        "Vacuum Cleaners",
        "Water Heaters",
        "Water Purifiers",
        "Ironing Systems"
      ]
    },
    {
      name: "Kids Furniture",
      subcategories: [
        "Kids Beds",
        "Bunk Beds",
        "Toddler Beds",
        "Changing Tables",
        "Kids Desks",
        "Play Tables",
        "Toy Storage",
        "Kids Chairs",
        "Bookshelves",
        "Cribs"
      ]
    }
  ];
  const fetchUserData = async () => {
    if (!token || !user || user.role?.code !== "2") {
      setUserData(null);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/customer/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success && data.customer?.role?.code === "2") {
        setUserData(data.customer);
      } else {
        setUserData(null);
        dispatch(logoutUser());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
      dispatch(logoutUser());
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user, token, dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/sawtar/');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/sawtar/ecommerce/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`);
      setSearchQuery("");
    }
  };

  const calculateDropdownPosition = (categoryIndex) => {
    if (typeof window !== 'undefined') {
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 800; // Approximate dropdown width
      const itemWidth = 120; // Approximate category item width
      const rightSpace = viewportWidth - (categoryIndex * itemWidth);
      
      return rightSpace < dropdownWidth ? 'right' : 'left';
    }
    return 'left';
  };

  const handleCategoryHover = (categoryName, categoryIndex) => {
    setDropdownPosition(calculateDropdownPosition(categoryIndex));
    setHoveredCategory(categoryName);
  };

  return (
    <div className="w-full z-50 font-sans sticky top-0 bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo and Mobile Menu */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#D26C44]"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <Link
              to="/sawtar"
              className="ml-2 md:ml-0 text-xl font-bold text-gray-800 flex items-center"
            >
              <span>SAWTAR</span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full flex rounded-full overflow-hidden border border-gray-300 focus-within:border-[#D26C44] focus-within:shadow-md transition-all">
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center h-full px-4 text-sm bg-gray-50 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                  <FaMapMarkerAlt className="mr-1" />
                  <span className="truncate max-w-[100px]">{selectedLocation}</span>
                </button>
                <AnimatePresence>
                  {showLocationDropdown && (
                    <motion.div
                      className="absolute left-0 mt-1 w-48 bg-white shadow-lg z-50 rounded-md border border-gray-200"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="py-1">
                        {locations.map((location) => (
                          <button
                            key={location}
                            type="button"
                            className={`block w-full text-left px-4 py-2 text-sm ${selectedLocation === location ? 'bg-gray-100 text-[#D26C44]' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => {
                              setSelectedLocation(location);
                              setShowLocationDropdown(false);
                            }}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full h-full py-2 px-4 pr-10 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D26C44]"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 text-gray-700 hover:text-[#D26C44]"
              aria-label="Search"
              onClick={() => document.getElementById("mobile-search").focus()}
            >
              <FaSearch size={18} />
            </button>
            <Link
              to="/sawtar/ecommerce/orders"
              className="p-2 text-gray-700 hover:text-[#D26C44] relative"
              aria-label="Orders"
            >
              <BsTruck size={20} />
            </Link>
            <Link
              to="/sawtar/ecommerce/cart"
              className="p-2 text-gray-700 hover:text-[#D26C44] relative"
              aria-label="Cart"
            >
              <CiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D26C44] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleOpen}
              className="p-2 text-[#D26C44] border border-[#D26C44] rounded-md flex items-center space-x-2 hover:bg-[#D26C44]/10 transition-colors"
              aria-label="AI View Design"
            >
              <TbEye size={16} />
              <span className="text-sm font-medium hidden md:inline">View Space</span>
            </button>
            {userData ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenuClick}
                    size="small"
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#D26C44' }}>
                      {userData.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => navigate('/sawtar/profile')}>
                    <Avatar sx={{ bgcolor: '#D26C44' }} />
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <button
                onClick={() => navigate('/sawtar/login')}
                className="p-2 text-gray-700 hover:text-[#D26C44]"
                aria-label="Login"
              >
                <FiUser size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-2 mb-3">
          <form onSubmit={handleSearch} className="w-full relative">
            <div className="flex">
              <div className="relative flex-1">
                <input
                  id="mobile-search"
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 px-4 pr-10 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D26C44] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D26C44]"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
              <button
                type="button"
                className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full text-gray-700 flex items-center"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <FaMapMarkerAlt className="mr-1" />
              </button>
            </div>
            <AnimatePresence>
              {showLocationDropdown && (
                <motion.div
                  className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-lg z-50 border border-gray-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="py-1">
                    {locations.map((location) => (
                      <button
                        key={location}
                        type="button"
                        className={`block w-full text-left px-4 py-2 text-sm ${selectedLocation === location ? 'bg-gray-100 text-[#D26C44]' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowLocationDropdown(false);
                        }}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* Desktop Categories */}
      <div className="hidden md:block bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto ">
          <nav className="flex justify-center">
            <ul className="flex space-x-1">
              {homeCategories.map((category, index) => (
                <li 
                  key={category.name}
                  className="relative group"
                  onMouseEnter={() => handleCategoryHover(category.name, index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:text-[#D26C44] cursor-pointer">
                    <span>{category.name}</span>
                  </div>
                  <AnimatePresence>
                    {hoveredCategory === category.name && (
                      <motion.div
                        ref={dropdownRef}
                        className={`absolute ${dropdownPosition === 'right' ? 'right-0' : 'left-0'} top-full w-[450px] bg-white shadow-xl rounded-b-md z-50 py-4 border border-gray-200`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                          maxWidth: 'calc(100vw - 40px)',
                          right: dropdownPosition === 'right' ? '0' : 'auto',
                          left: dropdownPosition === 'right' ? 'auto' : '0'
                        }}
                      >
                        <div className="grid grid-cols-3 gap-4 px-6">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory} className="mb-2">
                              <Link
                                to={`/categories/home-furniture/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                className="block py-1 text-gray-800 hover:text-[#D26C44]"
                              >
                                {subcategory}
                              </Link>
                            </div>
                          ))}
                        </div>
                        {["Living Room", "Bedroom", "Kitchen & Dining"].includes(category.name) && (
                          <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                            <h4 className="font-bold text-sm mb-3 text-[#D26C44]">POPULAR IN {category.name.toUpperCase()}</h4>
                            <div className="flex flex-wrap gap-2">
                              {category.name === "Living Room" && (
                                <>
                                  <Link to="/categories/home-furniture/living-room/sofa-sets" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Sofa Sets</Link>
                                  <Link to="/categories/home-furniture/living-room/sectional-sofas" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Sectional Sofas</Link>
                                  <Link to="/categories/home-furniture/living-room/coffee-tables" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Coffee Tables</Link>
                                </>
                              )}
                              {category.name === "Bedroom" && (
                                <>
                                  <Link to="/categories/home-furniture/bedroom/king-size-beds" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">King Size Beds</Link>
                                  <Link to="/categories/home-furniture/bedroom/mattresses" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Mattresses</Link>
                                  <Link to="/categories/home-furniture/bedroom/wardrobes" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Wardrobes</Link>
                                </>
                              )}
                              {category.name === "Kitchen & Dining" && (
                                <>
                                  <Link to="/categories/home-furniture/kitchen-dining/dining-sets" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Dining Sets</Link>
                                  <Link to="/categories/home-furniture/kitchen-dining/bar-stools" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Bar Stools</Link>
                                  <Link to="/categories/home-furniture/kitchen-dining/kitchen-islands" className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full">Kitchen Islands</Link>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      {/* Mobile Categories */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-3 space-y-2">
              <div className="border-t border-gray-100 pt-2">
                <div className="text-gray-500 uppercase text-xs font-semibold px-3 py-2">
                  Home & Furniture
                </div>
                {homeCategories.map((category) => (
                  <div key={`mobile-${category.name}`} className="mb-2">
                    <Link
                      to={`/categories/home-furniture/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
                    >
                      {category.name}
                    </Link>
                    <div className="pl-4 grid grid-cols-2 gap-1">
                      {category.subcategories.slice(0, 6).map((subcategory) => (
                        <Link
                          key={`mobile-${subcategory}`}
                          to={`/categories/home-furniture/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block py-1 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AiDesigner isOpen={showModal} onClose={handleClose} />
    </div>
  );
};

export default EcommerceNavbar;