import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TextField, Button, Typography, Box } from '@mui/material';
import homeimage from "../../assets/img/homepageimage2-min.png";

const QuoteModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
  className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 flex flex-col md:flex-row overflow-hidden relative"
            initial={{ scale: 0.9, y: "-50%" }}
            animate={{ scale: 1, y: "-50%" }}
            exit={{ scale: 0.9, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ top: "50%", position: "absolute" }}
          >
            {/* ❌ Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-red-500 z-10"
            >
              &times;
            </button>

            {/* ✅ Image (Hidden on Mobile) */}
            <div className="hidden md:block md:w-1/2 relative h-64 md:h-auto">
              <img
                src={homeimage}
                alt="Home Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                  Home Interior Quotation
                </h2>
                <p className="text-white text-sm md:text-base">
                  Get a personalized quote for your dream home design. Fast, easy, and free.
                </p>
              </div>
            </div>

            {/* ✅ Form Side (Full Width on Mobile) */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center items-center">
              <div className="w-full max-w-md">
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Get a Free Quote
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Tell us what you're looking for and we’ll reach out with your customized plan.
                </Typography>

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  <TextField label="Full Name" variant="outlined" fullWidth />
                  <TextField label="Email Address" type="email" variant="outlined" fullWidth />
                  <TextField label="Phone Number" type="tel" variant="outlined" fullWidth />
                  <TextField
                    label="Tell us about your project"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#D57651",
                      "&:hover": {
                        backgroundColor: "#c36645",
                      },
                      color: "#fff",
                    }}
                  >
                    Request Quote
                  </Button>
                </Box>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
