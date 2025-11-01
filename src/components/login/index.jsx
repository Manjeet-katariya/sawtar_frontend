// components/login/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../manageApi/context/AuthContext.jsx';
import loginimage from '../../assets/img/homepage.png';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [activeStep, setActiveStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    mobileNumber: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const { user, token, loading, login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // === DYNAMIC DASHBOARD PATH ===
  const getDashboardPath = () => {
    const map = {
      '0': '/superadmin/',
      '1': '/admin/',
      '2': '/customer/',
      '3': '/employee/',
      '5': '/vendor-b2c/',
      '6': '/vendor-b2b/',
      '7': '/freelancer/',
      '8': '/business/',
    };
    return `/sawtar/dashboard${map[user?.role?.code] || ''}`;
  };

  // === REDIRECT AFTER LOGIN ===
  useEffect(() => {
    if (user && token) {
      const path = getDashboardPath();
      navigate(path, { replace: true });
    }
  }, [user, token, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setActiveStep(0);
    setUserType('');
    setVendorType('');
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      mobileNumber: '',
      rememberMe: false,
    });
  };

  const handleNext = () => {
    if (!userType) {
      setErrors({ general: 'Please select an account type' });
      return;
    }
    if (userType === 'vendor' && !vendorType) {
      setErrors({ general: 'Please select a vendor type (B2B or B2C)' });
      return;
    }
    setActiveStep(1);
    setErrors({});
  };

  const handleBack = () => {
    setActiveStep(0);
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    if (userType === 'vendor') setVendorType('');
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setVendorType('');
    setErrors({});
  };

  const handleVendorTypeChange = (e) => {
    setVendorType(e.target.value);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (activeTab === 'register') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      else {
        const dob = new Date(formData.dateOfBirth);
        if (isNaN(dob.getTime())) newErrors.dateOfBirth = 'Invalid date';
        else {
          const age = new Date().getFullYear() - dob.getFullYear();
          if (age < 18) newErrors.dateOfBirth = 'Must be 18 or older';
        }
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (activeTab === 'login') {
        const { email, password } = formData;

        let loginEndpoint;
        switch (userType) {
          case 'customer': loginEndpoint = 'http://localhost:5000/api/customer/login'; break;
          case 'employee': loginEndpoint = '/api/auth/employee/login'; break;
          case 'vendor': loginEndpoint = vendorType === 'b2b' ? '/api/vendor/b2b/login' : '/api/vendor/b2c/login'; break;
          case 'business': loginEndpoint = '/api/business/login'; break;
          case 'freelancer': loginEndpoint = '/api/freelancer/login'; break;
          default: throw new Error('Invalid account type');
        }

        const response = await login(email, password, loginEndpoint);

        if (!response.success) {
          const fieldErrors = {};
          if (response.errors?.length) {
            response.errors.forEach(err => { fieldErrors[err.field] = err.message; });
          }
          setErrors(fieldErrors);
          setErrors(prev => ({ ...prev, general: response.message || 'Login failed' }));
          return;
        }

        setSuccessMessage(response.message || 'Login successful!');
      } else {
        if (userType !== 'customer') {
          setErrors({ general: 'Only customer registration is available' });
          return;
        }

        const { name, email, password, confirmPassword, dateOfBirth } = formData;
        const registrationData = {
          name,
          email: email.toLowerCase().trim(),
          password,
          confirmPassword,
          date_of_birth: dateOfBirth,
          agreed_to_terms: true,
        };

        const response = await register(registrationData, 'http://localhost:5000/api/customer/');

        if (!response.success) {
          const fieldErrors = {};
          if (response.errors?.length) {
            response.errors.forEach(err => { fieldErrors[err.field] = err.message; });
          }
          setErrors(fieldErrors);
          setErrors(prev => ({ ...prev, general: response.message || 'Registration failed' }));
          return;
        }

        setSuccessMessage(response.message || 'Registration successful!');

        setTimeout(async () => {
          try {
            await login(email, password, 'http://localhost:5000/api/customer/login');
          } catch (loginError) {
            setErrors({ general: 'Registration successful! Please login manually.' });
          }
        }, 1000);
      }
    } catch (err) {
      setErrors({ general: err.message || 'An error occurred. Please try again.' });
    }
  };

  const renderError = (field) => errors[field] ? (
    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
      {errors[field]}
    </Typography>
  ) : null;

  const steps = ['Select Account Type', activeTab === 'login' ? 'Login' : 'Register'];

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage: `url(${loginimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          color: '#fff',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}
          >
            {activeTab === 'login' ? 'Welcome Back!' : 'Join Us!'}
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            {activeStep === 0
              ? 'Select your account type to continue'
              : activeTab === 'login'
              ? userType === 'customer'
                ? 'Customer Portal'
                : userType === 'employee'
                ? 'Employee Portal'
                : userType === 'business'
                ? 'Business Portal'
                : userType === 'freelancer'
                ? 'Freelancer Portal'
                : `Vendor Portal (${vendorType?.toUpperCase()})`
              : 'Customer Registration'}
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 500,
            p: { xs: 3, md: 4 },
            boxShadow: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
              <Tab label="Login" value="login" />
              <Tab label="Register" value="register" />
            </Tabs>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>

            {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}><CircularProgress /></Box>}

            {activeStep === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Typography variant="h5" align="center" gutterBottom>Select Account Type</Typography>
                <RadioGroup value={userType} onChange={handleUserTypeChange} sx={{ gap: 2, mt: 3 }}>
                  {['employee', 'customer', 'vendor', 'business', 'freelancer'].map((type) => (
                    <Card
                      key={type}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderColor: userType === type ? 'primary.main' : 'divider',
                        backgroundColor: userType === type ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                      }}
                    >
                      <FormControlLabel
                        value={type}
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1">
                              {type === 'vendor' ? 'Vendor' : type.charAt(0).toUpperCase() + type.slice(1)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {type === 'vendor' ? 'B2B or B2C' : `${type} portal access`}
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                      {type === 'vendor' && userType === 'vendor' && (
                        <Box sx={{ ml: 4, mt: 2 }}>
                          <Typography variant="subtitle2">Vendor Type:</Typography>
                          <RadioGroup value={vendorType} onChange={handleVendorTypeChange}>
                            <FormControlLabel value="b2b" control={<Radio size="small" />} label="B2B" />
                            <FormControlLabel value="b2c" control={<Radio size="small" />} label="B2C" />
                          </RadioGroup>
                        </Box>
                      )}
                    </Card>
                  ))}
                </RadioGroup>
                <Box sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleNext}
                    disabled={!userType || (userType === 'vendor' && !vendorType)}
                  >
                    Continue
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Typography variant="h5" align="center" gutterBottom>
                  {activeTab === 'login'
                    ? `${userType.charAt(0).toUpperCase() + userType.slice(1)}${userType === 'vendor' ? ` (${vendorType.toUpperCase()})` : ''} Login`
                    : 'Customer Registration'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  {activeTab === 'register' && (
                    <>
                      <TextField margin="normal" required fullWidth name="name" label="Full Name" value={formData.name} onChange={handleInputChange} error={!!errors.name} helperText={errors.name} />
                      <TextField margin="normal" required fullWidth name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} InputLabelProps={{ shrink: true }} />
                      <TextField margin="normal" fullWidth name="mobileNumber" label="Mobile (Optional)" type="tel" value={formData.mobileNumber} onChange={handleInputChange} />
                    </>
                  )}
                  <TextField margin="normal" required fullWidth name="email" label="Email" value={formData.email} onChange={handleInputChange} error={!!errors.email} helperText={errors.email} />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {activeTab === 'register' && (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                    />
                  )}
                  {activeTab === 'login' && (
                    <FormControlLabel
                      control={<Checkbox name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} />}
                      label="Remember me"
                    />
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button variant="outlined" onClick={handleBack}>Back</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                      {activeTab === 'login' ? 'Login' : 'Register'}
                    </Button>
                  </Box>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    {activeTab === 'login' ? (
                      <>
                        No account?{' '}
                        <Link component="button" onClick={() => { setActiveTab('register'); setUserType('customer'); setActiveStep(1); }} underline="hover">
                          Register as Customer
                        </Link>
                      </>
                    ) : (
                      <>
                        Have account?{' '}
                        <Link component="button" onClick={() => setActiveTab('login')} underline="hover">
                          Login
                        </Link>
                      </>
                    )}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    <Link href="/sawtar/admin/login" underline="hover">
                      Admin/Superadmin Login
                    </Link>
                  </Typography>
                </Box>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;