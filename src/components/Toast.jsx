import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { styled } from '@mui/material/styles';

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#C45A34',
  color: 'white',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#A04A2A',
    boxShadow: 'none',
  },
}));

export default function FreelancerToast() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleRegister = () => {
    window.location.href = '/sawtar/freelancer/registration';
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{
        '& .MuiSnackbar-root': {
          position: 'fixed',
          bottom: '24px',
          left: '24px',
        },
      }}
    >
      <div style={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        maxWidth: '420px',
        width: '100%',
        borderLeft: '4px solid #C45A34',
      }}>
        <div style={{
          backgroundColor: 'rgba(196, 90, 52, 0.1)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <WorkOutlineIcon sx={{ color: '#C45A34', fontSize: '1.25rem' }} />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: 0,
            }}>
              Start Your Freelance Journey
            </h3>
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: 0,
            marginBottom: '16px'
          }}>
            Join our platform and connect with clients looking for your skills. Grow your business on your terms.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <ColorButton
              variant="contained"
              onClick={handleRegister}
              startIcon={<RocketLaunchIcon sx={{ fontSize: '1rem' }} />}
            >
              Register Now
            </ColorButton>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                color: '#6B7280',
                borderColor: '#E5E7EB',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                },
              }}
            >
              Maybe Later
            </Button>
          </div>
        </div>
        <IconButton
          size="small"
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: '#9CA3AF',
            alignSelf: 'flex-start',
            '&:hover': {
              color: '#6B7280',
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Snackbar>
  );
}