// src/CmsApp.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import CmsLayout from '../CMS/components/layout/CmsLayout';
import CmsRoutes from '../CMS/routes';
import { cmsTheme } from '../CMS/theme/cmsTheme';
import { useSelector } from 'react-redux';
import '../CMS/styles/cms-tailwind.css';

const CmsApp = () => {
  const { loading, isAuthenticated } = useSelector(s => s.auth);

  // While Redux is re-hydrating from localStorage → spinner
  if (loading) {
    return (
      <ThemeProvider theme={cmsTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress size={56} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={cmsTheme}>
      <CssBaseline />
      <CmsLayout>
        <CmsRoutes />
      </CmsLayout>
    </ThemeProvider>
  );
};

export default CmsApp;