import React from 'react';
import { Box, Typography, Card, CardContent, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import mockupImage from '../../assets/img/homepage.png'; // Ensure this file exists
import { FaLightbulb, FaClock, FaUserCheck } from 'react-icons/fa';
const backgroundImageUrl = '/images/zigzag-light-bg.png';

const ConsultationPage = () => {
  // Animation variants for the cards
  const zoomAnimation = {
    animate: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Card data with icons
  const featureCards = [
    {
      title: 'Expert Support',
      description: 'Consult with our industry-leading professionals.',
      icon: <FaLightbulb size={24} color="#0072ff" />,
    },
    {
      title: 'Quick Response',
      description: 'Get answers and guidance within hours.',
      icon: <FaClock size={24} color="#0072ff" />,
    },
    {
      title: 'Personalized Plans',
      description: 'Tailored solutions for your unique needs.',
      icon: <FaUserCheck size={24} color="#0072ff" />,
    },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Top Section: Background Image and Form */}
      <Box
        sx={{
          minHeight: '60vh',
          backgroundImage: `url(${mockupImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-end' },
          px: { xs: 3, md: 10 },
          py: 8,
          gap: { xs: 4, md: 6 },
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
            zIndex: 1,
          },
        }}
      >
        {/* Right Side: Consultation Form */}
        <Box
          sx={{
            flex: { xs: 'none', md: 1 },
            maxWidth: { xs: '100%', md: '450px' },
            zIndex: 2,
          }}
        >
          <Card
            sx={{
              p: { xs: 3, md: 4 },
              boxShadow: 8,
              borderRadius: 3,
              backgroundColor: '#ffffff',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: '#1a202c',
              }}
            >
              Book a Free Consultation
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                required
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0072ff',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                required
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0072ff',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                margin="normal"
                required
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0072ff',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  backgroundColor: '#D26C44',
                  '&:hover': {
                    backgroundColor: '#D26C44',
                  },
                }}
              >
                Schedule Now
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Bottom Section: Feature Cards */}
    <Box
  sx={{
    py: 10,
    px: { xs: 3, md: 10 },
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
  }}
>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
      gap: 4,
      maxWidth: '1200px',
      mx: 'auto',
    }}
  >
    {featureCards.map((card, index) => (
      <motion.div
        key={index}
        style={{ height: '100%' }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          elevation={3}
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* Icon Box - Left */}
          <Box
            sx={{
              backgroundColor: '#f0f4f8',
              borderRadius: '16px',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 3,
            }}
          >
            {card.icon}
          </Box>

          {/* Text Content - Right */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 0.5, color: '#1a202c' }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#4b5563' }}
            >
              {card.description}
            </Typography>
          </Box>
        </Card>
      </motion.div>
    ))}
  </Box>
</Box>
    </Box>
  );
};

export default ConsultationPage;