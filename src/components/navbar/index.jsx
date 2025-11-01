// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IoMdLogIn, IoMdMail } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../manageApi/store/authSlice'; // Adjust path to your authSlice
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
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import axios from "axios";
import { CiShoppingCart } from "react-icons/ci";
import { useCart } from '../../manageApi/context/CartContext'; // Adjust path

const navItems = [
  {
    title: 'Interior Design',
    dropdown: [
      { title: 'Bedroom Designs', path: '/sawtar/interior/bedroom' },
      { title: 'Modular Kitchen Designs', path: '/sawtar/interior/modular-kitchen' },
      { title: 'Wardrobe Designs', path: '/sawtar/interior/wardrobe' },
      { title: 'Bathroom Designs', path: '/sawtar/interior/bathroom' },
      { title: 'Living Room Designs', path: '/sawtar/interior/living-room' },
      { title: 'Study Room Designs', path: '/sawtar/interior/study-room' },
    ],
  },
  {
    title: 'E-commerce Interiors',
    path: '/sawtar/ecommerce/',
    dropdown: [
      { title: 'Furniture', path: '/ecommerce/furniture' },
      { title: 'Decor', path: '/ecommerce/decor' },
      { title: 'Lighting', path: '/ecommerce/lighting' },
    ],
  },
  {
    title: 'AI Designs',
    path: '/sawtar/designs',
    dropdown: [
      { title: 'AI Room Planner', path: '/ai/room-planner' },
      { title: 'AI Furniture Suggestions', path: '/ai/furniture' },
      { title: 'AI Interior Calculator', path: '/ai/interior-calculator' },
    ],
  },
  {
    title: 'Find Professionals',
    path: '/sawtar/freelancer',
    dropdown: [
      { title: 'Plumber', path: '/freelancers/plumber' },
      { title: 'Electrician', path: '/freelancers/electrician' },
      { title: 'Maid', path: '/freelancers/maid' },
      { title: 'Raj Mistri', path: '/freelancers/raj-mistri' },
      { title: 'Carpenter', path: '/freelancers/carpenter' },
      { title: 'Cleaner', path: '/freelancers/cleaner' },
      { title: 'Driver', path: '/freelancers/driver' },
      { title: 'Pandit Ji', path: '/freelancers/pandit-ji' },
      { title: 'Painter', path: '/freelancers/painter' },
      { title: 'Architecture', path: '/freelancers/architecture' },
      { title: 'Designer', path: '/freelancers/designers' },
      { title: 'Sawtar LuxInterior', path: '/freelancers/luxinterior' },
      { title: 'Cook', path: '/freelancers/cook' },
      { title: 'Toilet Cleaner', path: '/freelancers/toilet-cleaner' },
      { title: 'Event Planner', path: '/freelancers/event-planner' },
      { title: 'Catering Services', path: '/freelancers/catering' },
      { title: 'Academic Teachers', path: '/freelancers/teachers' },
      { title: 'Baby Sitter', path: '/freelancers/baby-sitter' },
      { title: 'Gardener', path: '/freelancers/gardener' },
      { title: 'Post a Project', path: '/freelancers/post-project' },
    ],
  },
  {
    title: 'Magazines',
    path: '/sawtar/magazines',
  },
  {
    title: 'Culture',
    path: '/sawtar/culture',
  },
];

const topLinks = [
  { label: 'How It Works', path: '/sawtar/how-it-works' },
  { label: 'Refer a Friend', path: '/refer' },
  { label: 'Support', path: '/support' },
];

// Function to map role to label
const getRoleLabel = (role) => {
  switch (role) {
    case 2:
      return 'Customer';
    default:
      return 'Unknown';
  }
};

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);
  const { cartCount } = useCart();

  const fetchUserData = async () => {
    if (!token || !user || user.role?.code !== "2") {
      setUserData(null);
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user, token, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setUserData(null);
      navigate('/sawtar/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleDropdownToggle = (title) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: '#D26C44' }}>
          {userData?.name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
            {userData?.name || 'User'}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            {getRoleLabel(userData?.role?.code)}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <MenuItem
        onClick={() => {
          navigate('/sawtar/profile');
          setMobileDrawerOpen(false);
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleLogout();
          setMobileDrawerOpen(false);
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Box>
  );

  return (
    <div className="w-full z-50 font-sans sticky top-0 bg-white">
      {/* Top Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="flex justify-between items-center px-4 sm:px-6 py-2">
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
            {topLinks.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-3 sm:gap-6 items-center text-gray-600 text-xs sm:text-sm">
             <button
                  className="hidden md:block border border-gray-300 text-gray-600 rounded-md px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-[#D26C44] hover:text-white"
                  onClick={() => navigate('/sawtar/consultation')}
                >
                  Social networks
                </button>
                <button
                  className="flex items-center gap-1 sm:gap-2 bg-[#D26C44] text-white rounded-md px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-[#c05a38] shadow-sm hover:shadow-md"
                  onClick={() => navigate('/sawtar/subscribe')}
                >
                  <IoMdMail className="text-sm sm:text-base" />
                  <span>Subscribe</span>
                </button>
                <button
                  className="flex items-center gap-1 sm:gap-2 bg-[#D26C44] text-white rounded-md px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-[#c05a38] shadow-sm hover:shadow-md"
                  onClick={() => navigate('/sawtar/login')}
                >
                  <IoMdLogIn className="text-sm sm:text-base" />
                  <span>Login</span>
                </button>
            {/* {isLoading ? (
              <CircularProgress size={24} />
            ) : userData ? (
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenuClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#D26C44' }}>
                      {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ ml: 1, display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {userData?.name || 'User'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {getRoleLabel(userData?.role?.code)}
                      </Typography>
                    </Box>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
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
              <>
               
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/sawtar/login")}
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
              </>
            )} */}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="sticky top-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3">
          {/* Logo */}
          <Link
            to="/sawtar"
            className="text-2xl font-bold text-gray-800"
            aria-label="SAWTAR Home"
          >
            SAWTAR
          </Link>

          {/* Nav Links (Desktop) */}
          <ul className="hidden md:flex gap-4 text-sm font-medium text-gray-700">
            {navItems.map((item, index) => (
              <li key={item.title} className="relative px-2 py-3 group">
                <div className="relative inline-block text-left">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="inline-flex items-center gap-1 hover:text-black transition cursor-pointer py-1 text-sm font-medium text-gray-700"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      {item.title}
                      {item.dropdown && (
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-4 text-gray-400 transition-transform group-hover:rotate-180"
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-black transition cursor-pointer py-1 text-sm font-medium text-gray-700"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      {item.title}
                      {item.dropdown && (
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-4 text-gray-400 transition-transform group-hover:rotate-180"
                        />
                      )}
                    </button>
                  )}

                  {item.dropdown && (
                    <div
                      className="absolute left-0 z-10 mt-3 w-max max-w-[90vw] bg-white shadow-lg ring-1 ring-black/5 grid gap-2 auto-rows-fr opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out"
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(
                          3,
                          Math.max(1, Math.ceil(item.dropdown.length / 4))
                        )}, minmax(140px, 1fr))`,
                      }}
                      aria-labelledby={`${item.title}-dropdown`}
                    >
                      {item.dropdown.map((drop, idx) => (
                        <Link
                          key={`${drop.title}-${idx}`}
                          to={drop.path}
                          className="block max-w-[250px] py-2 px-4 text-sm text-gray-700 hover:bg-[#D26C44]/20 hover:text-gray-900 transition-colors"
                        >
                          {drop.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* CTA, Cart & Hamburger */}
          <div className="flex items-center gap-4">
            <button
              className="hidden md:block bg-[#D26C44] rounded-md text-white px-5 py-2 text-sm font-medium shadow-md hover:bg-[#c05a34] transition-colors"
              onClick={() => navigate('/sawtar/consultation')}
              aria-label="Book a Consultation"
            >
              Book Consultation
            </button>
            
            <button
              className="md:hidden cursor-pointer p-2"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <FaTimes size={20} className="text-gray-700" />
              ) : (
                <FaBars size={20} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <ul className="flex flex-col p-4">
              {navItems.map((item, index) => (
                <li key={item.title} className="py-2">
                  {item.dropdown ? (
                    <div>
                      <button
                        className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-black transition"
                        onClick={() => handleDropdownToggle(item.title)}
                        aria-expanded={dropdownOpen[item.title] || false}
                        aria-haspopup="true"
                      >
                        {item.title}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className={`size-4 text-gray-400 transition-transform ${
                            dropdownOpen[item.title] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {dropdownOpen[item.title] && (
                        <div className="pl-4 pt-2">
                          {item.dropdown.map((drop, idx) => (
                            <Link
                              key={`${drop.title}-${idx}`}
                              to={drop.path}
                              className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition"
                              onClick={() => setIsMobileOpen(false)}
                            >
                              {drop.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="block text-sm font-medium text-gray-700 hover:text-black transition"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
              {!userData && (
                <>
                  <li className="py-2">
                    <Link
                      to="/sawtar/login"
                      className="block text-sm font-medium text-gray-700 hover:text-black transition"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                  <li className="py-2">
                    <Link
                      to="/sawtar/pro-login"
                      className="block text-sm font-medium text-gray-700 hover:text-black transition"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Sign In as Pro
                    </Link>
                  </li>
                </>
              )}
              <li className="py-2">
                <button
                  className="w-full text-left bg-[#D26C44] rounded-md text-white px-4 py-2 text-sm font-medium hover:bg-[#c05a34] transition-colors"
                  onClick={() => {
                    navigate('/sawtar/consultation');
                    setIsMobileOpen(false);
                  }}
                >
                  Book Consultation
                </button>
              </li>
              {userData && (
                <li className="py-2">
                  <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
                    <IconButton
                      onClick={handleMobileDrawerToggle}
                      size="small"
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                      aria-controls={mobileDrawerOpen ? 'mobile-account-drawer' : undefined}
                      aria-haspopup="true"
                      aria-expanded={mobileDrawerOpen ? 'true' : undefined}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#D26C44' }}>
                        {userData.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          {userData.name || 'User'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {getRoleLabel(userData?.role?.code)}
                        </Typography>
                      </Box>
                    </IconButton>
                  </Box>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Off-Canvas Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        sx={{ zIndex: 1300 }}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
};

export default Navbar;