import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../../manageApi/store/authSlice';
import { useCmsContext } from '../../contexts/CmsContext';
import SearchBar from '../ui/SearchBar';
import { FiBell, FiMenu, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import { getRoleColors } from '../../../../manageApi/utils/roleColors';

const Topbar = () => {
  const { toggleSidebar, sidebarCollapsed } = useCmsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const colors = getRoleColors(user?.role?.code);

  // Determine profile URL based on role code
  const getProfileUrl = () => {
    const roleCode = user?.role?.code;
    switch (roleCode) {
      case '0':
        return '/sawtar/cms/superadmin/myprofile';
      case '1':
        return '/sawtar/cms/admin/myprofile';
      case '2':
        return '/sawtar/cms/customer/myprofile';
      case '3':
        return '/sawtar/cms/employee/myprofile';
      case '6':
        return '/sawtar/cms/seller/b2b/myprofile';
      case '5':
        return '/sawtar/cms/seller/b2c/myprofile';
       case '8':
        return '/sawtar/cms/business/myprofile';
        case '7':
        return '/sawtar/cms/freelancer/myprofile';
      default:
        return '/sawtar/cms/profile';
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    const profileUrl = getProfileUrl();
    navigate(profileUrl);
    handleMenuClose();
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/sawtar/');
    handleMenuClose();
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 
      transition-all duration-300 ease-in-out
      ${sidebarCollapsed ? 'left-20 lg:left-20' : 'left-64 lg:left-64'}`}
    >
      <div className="flex justify-between items-center w-full h-full px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200 hover:shadow-sm"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200 hover:shadow-sm"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 inline-flex items-center justify-center w-3 h-3 text-[10px] font-bold text-white bg-red-500 rounded-full">
              3
            </span>
          </button>
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
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: colors.primary,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ 
                  ml: 1, 
                  display: { xs: 'none', md: 'flex' }, 
                  flexDirection: 'column', 
                  alignItems: 'flex-start' 
                }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {user?.role?.name || 'Unknown Role'}
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
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
            <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
              <Avatar sx={{ bgcolor: colors.primary }} />
              <Typography component="span" sx={{ ml: 1 }}>
                My Profile
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
              <FiSettings style={{ marginRight: '12px' }} />
              <Typography component="span">
                Settings
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <FiLogOut fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;