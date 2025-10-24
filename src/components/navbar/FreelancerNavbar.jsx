import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Components
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Drawer,
  List,
  ListItem,
  Divider,
  Avatar,
  Box,
  Modal,
  Paper,
  Stack,
  styled
} from "@mui/material";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Local Assets
import phoneRingGif from "../../assets/gif/callringing.webp";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const FreelancerNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [hasNotifications, setHasNotifications] = useState(true);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
  };

  const handleNotificationsToggle = (event) => {
    setNotificationsOpen(!notificationsOpen);
    setHasNotifications(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleConnect = () => {
    console.log("Connect call");
    toggleContactModal();
  };

  const handleDisconnect = () => {
    console.log("Disconnect call");
    toggleContactModal();
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  // Sample notifications data
  const notifications = [
    { id: 1, text: "New message from client", time: "2 hours ago", read: false },
    { id: 2, text: "Your listing was approved", time: "1 day ago", read: true },
    { id: 3, text: "New project matching your skills", time: "3 days ago", read: true },
  ];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => navigate("/sawtar/")}
          >
            SAWTAR
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {/* Free Listing Link */}
            <Button 
    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg shadow-sm"
              sx={{ fontWeight: 500 }}
              onClick={() => navigate("/sawtar/freelancer/free-listing")}
            >
              Free Listing
            </Button>

            {/* Notifications */}
            <IconButton
              size="large"
              aria-label="show notifications"
    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg shadow-sm"
              onClick={handleNotificationsToggle}
            >
              <StyledBadge color="error" variant="dot" invisible={!hasNotifications}>
                {notificationsOpen ? <NotificationsIcon /> : <NotificationsNoneIcon />}
              </StyledBadge>
            </IconButton>

            {/* Notification Menu */}
            <Menu
              anchorEl={notificationsOpen ? document.body : null}
              open={Boolean(notificationsOpen)}
              onClose={() => setNotificationsOpen(false)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: {
                  width: 320,
                  maxHeight: 400,
                  overflow: 'auto',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <MenuItem disabled sx={{ fontWeight: 600 }}>
                Notifications
              </MenuItem>
              <Divider />
              {notifications.map((notification) => (
                <MenuItem key={notification.id} sx={{ bgcolor: !notification.read ? 'action.selected' : '' }}>
                  <ListItemText
                    primary={notification.text}
                    secondary={notification.time}
                    primaryTypographyProps={{ fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12 }}
                  />
                </MenuItem>
              ))}
              <Divider />
              <MenuItem sx={{ justifyContent: 'center', color: 'primary.main' }}>
                View All Notifications
              </MenuItem>
            </Menu>

            {/* Talk to Us Button */}
          <Button
  variant="contained"
  startIcon={
    <Box
      component="img"
      src={phoneRingGif}
      sx={{ width: 24, height: 24 }}
    />
  }
  sx={{
    ml: 1,
    borderRadius: 2,
    boxShadow: 'none',
    bgcolor: '#D26C44', // <-- main button color
    color: 'white',     // <-- text color (optional for contrast)
    '&:hover': {
      boxShadow: 'none',
      bgcolor: '#b55533' // <-- darker shade on hover
    }
  }}
  onClick={toggleContactModal}
>
  Talk to us
</Button>


            {/* Profile */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg shadow-sm"
            >
              <Avatar 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'primary.main' }}
              />
            </IconButton>

            {/* Profile Menu */}
            <Menu
              id="profile-menu"
              anchorEl={profileMenuAnchor}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: {
                  width: 200,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <MenuItem onClick={() => { navigate("/profile"); handleProfileMenuClose(); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => { navigate("/settings"); handleProfileMenuClose(); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleLogout(); handleProfileMenuClose(); }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="start"
    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg shadow-sm"
            aria-label="menu"
            sx={{ display: { md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar 
              src="https://randomuser.me/api/portraits/women/44.jpg" 
              sx={{ width: 56, height: 56, border: '2px solid', borderColor: 'primary.main' }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                Jane Doe
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Professional Designer
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem button onClick={() => { navigate("/sawtar/freelancer/free-listing"); handleDrawerToggle(); }}>
              <ListItemText primary="Free Listing" />
            </ListItem>
            <ListItem button onClick={() => { setNotificationsOpen(true); handleDrawerToggle(); }}>
              <ListItemText primary="Notifications" />
              <StyledBadge color="error" variant="dot" invisible={!hasNotifications}>
                {notificationsOpen ? <NotificationsIcon /> : <NotificationsNoneIcon />}
              </StyledBadge>
            </ListItem>
          </List>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem button onClick={() => { navigate("/profile"); handleDrawerToggle(); }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button onClick={() => { navigate("/settings"); handleDrawerToggle(); }}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<Box component="img" src={phoneRingGif} sx={{ width: 20, height: 20 }} />}
              sx={{ mb: 2 }}
              onClick={() => { toggleContactModal(); handleDrawerToggle(); }}
            >
              Talk to us
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => { handleLogout(); handleDrawerToggle(); }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <Modal
            open={showContactModal}
            onClose={toggleContactModal}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Paper sx={{ 
                width: 300, 
                overflow: 'hidden',
                borderRadius: 3,
                position: 'relative'
              }}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    zIndex: 1
                  }}
                  onClick={toggleContactModal}
                >
                  <CloseIcon />
                </IconButton>
                
                <Box sx={{ 
                  bgcolor: 'info.light', 
                  p: 3,
                  textAlign: 'center'
                }}>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Incoming voice call
                  </Typography>
                  <Box sx={{
                    mt: 2,
                    mb: 1,
                    mx: 'auto',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: '4px solid',
                    borderColor: 'background.paper',
                    overflow: 'hidden'
                  }}>
                    <Box 
                      component="img" 
                      src={phoneRingGif} 
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </Box>
                </Box>
                
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.primary">
                    Ms. Neha is calling you at 7004717328
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" sx={{ mt: 1 }}>
                    Let us assist you to create a <Box component="span" fontWeight="bold">FREE</Box> Business Listing
                  </Typography>
                </Box>
                
                <Stack direction="row" justifyContent="space-around" sx={{ pb: 3, px: 2 }}>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ 
                      minWidth: 56, 
                      height: 56,
                      flexDirection: 'column',
                      '& .MuiButton-startIcon': { margin: 0 }
                    }}
                    startIcon={<PhoneDisabledIcon  />}
                    onClick={handleDisconnect}
                  >
                    <Typography variant="caption" sx={{ mt: 0.5 }}>Disconnect</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ 
                      minWidth: 56, 
                      height: 56,
                      flexDirection: 'column',
                      '& .MuiButton-startIcon': { margin: 0 }
                    }}
                    startIcon={<PhoneIcon />}
                    onClick={handleConnect}
                  >
                    <Typography variant="caption" sx={{ mt: 0.5 }}>Connect</Typography>
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default FreelancerNavbar;