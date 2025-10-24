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

// Redirect based on role after login
useEffect(() => {
  if (user && token) {
    const roleCode = user.role?.code;
    switch (roleCode) {
      case '3': // Employee
        navigate('/sawtar/cms/employee/dashboard');
        break;
      case '2': // Customer
        navigate('/sawtar/');
        break;
      case '6': // Vendor B2B
        navigate('/sawtar/cms/seller/b2b/dashboard');
        break;
      case '5': // Vendor B2C
        navigate('/sawtar/cms/seller/b2c/dashboard');
        break;
      case '8': // Business
        navigate('/sawtar/cms/business/dashboard');
        break;
      case '7': // Freelancer
        navigate('/sawtar/cms/freelancer/dashboard');
        break;
      default:
        // do nothing if role is missing or not mapped
        break;
    }
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
    setActiveStep((prev) => prev + 1);
    setErrors({});
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    if (userType === 'vendor') {
      setVendorType('');
    }
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    setVendorType('');
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
  };

  const handleVendorTypeChange = (event) => {
    setVendorType(event.target.value);
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validations
    if (activeTab === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const dob = new Date(formData.dateOfBirth);
        if (isNaN(dob.getTime())) {
          newErrors.dateOfBirth = 'Invalid date of birth format';
        } else {
          const age = new Date().getFullYear() - dob.getFullYear();
          if (age < 18) {
            newErrors.dateOfBirth = 'You must be at least 18 years old';
          }
        }
      }
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (activeTab === 'login') {
        // Handle login
        const { email, password } = formData;

        // Determine login endpoint based on user type
        let loginEndpoint;
        switch (userType) {
          case 'customer':
            loginEndpoint = 'http://localhost:5000/api/customer/login';
            break;
          case 'employee':
            loginEndpoint = '/api/auth/employee/login';
            break;
          case 'vendor':
            loginEndpoint = vendorType === 'b2b' ? '/api/vendor/b2b/login' : '/api/vendor/b2c/login';
            break;
          case 'business':
            loginEndpoint = '/api/business/login';
            break;
          case 'freelancer':
            loginEndpoint = '/api/freelancer/login';
            break;
          default:
            throw new Error('Invalid account type');
        }

        const response = await login(email, password, loginEndpoint);

        if (!response.success) {
          if (response.errors && Array.isArray(response.errors)) {
            const fieldErrors = {};
            response.errors.forEach((error) => {
              fieldErrors[error.field] = error.message;
            });
            setErrors(fieldErrors);
          } else {
            setErrors({ general: response.message || 'Login failed' });
          }
          return;
        }

        setSuccessMessage(response.message || 'Login successful!');
      } else {
        // Handle registration (only for customers)
        if (userType !== 'customer') {
          setErrors({ general: 'Only customer registration is available at this time' });
          return;
        }

        const { name, email, password, confirmPassword, dateOfBirth } = formData;

        // Prepare registration data
        const registrationData = {
          name,
          email: email.toLowerCase().trim(),
          password,
          confirmPassword,
          date_of_birth: dateOfBirth,
          agreed_to_terms: true, // Required by backend
        };

        const response = await register(registrationData, 'http://localhost:5000/api/customer/');

        if (!response.success) {
          if (response.errors && Array.isArray(response.errors)) {
            const fieldErrors = {};
            response.errors.forEach((error) => {
              fieldErrors[error.field] = error.message;
            });
            setErrors(fieldErrors);
          } else {
            setErrors({ general: response.message || 'Registration failed' });
          }
          return;
        }

        setSuccessMessage(response.message || 'Registration successful!');

        // Auto-login after successful registration
        setTimeout(async () => {
          try {
            const loginResponse = await login(email, password, 'http://localhost:5000/api/customer/login');
            if (!loginResponse.success) {
              setErrors({ general: 'Registration successful! Please login manually.' });
            }
          } catch (loginError) {
            setErrors({ general: 'Registration successful! Please login manually.' });
          }
        }, 1000);
      }
    } catch (err) {
      setErrors({ general: err.message || 'An error occurred. Please try again.' });
    }
  };

  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
        {errors[fieldName]}
      </Typography>
    ) : null;
  };

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
          flex: '1',
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
                ? 'Customer Portal - Manage your account'
                : userType === 'employee'
                ? 'Employee Portal - Access your dashboard'
                : userType === 'business'
                ? 'Business Portal - Manage your business account'
                : userType === 'freelancer'
                ? 'Freelancer Portal - Manage your freelancer account'
                : `Vendor Portal (${vendorType?.toUpperCase()}) - Manage your vendor account`
              : 'Customer Registration'}
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          flex: '1',
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
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{ mb: 2 }}
            >
              <Tab label="Login" value="login" />
              <Tab label="Register" value="register" />
            </Tabs>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {errors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.general}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {activeStep === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h5" component="h2" gutterBottom align="center">
                  Select Your Account Type
                </Typography>
                <RadioGroup
                  name="account-type"
                  value={userType}
                  onChange={handleUserTypeChange}
                  sx={{ gap: 2, mt: 3 }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: userType === 'employee' ? 'primary.main' : 'divider',
                      backgroundColor: userType === 'employee' ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value="employee"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">Employee</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Regular staff members
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Card>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: userType === 'customer' ? 'primary.main' : 'divider',
                      backgroundColor: userType === 'customer' ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value="customer"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">Customer</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Clients and service users
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Card>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: userType === 'vendor' ? 'primary.main' : 'divider',
                      backgroundColor: userType === 'vendor' ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value="vendor"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">Vendor</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Manage your vendor account (B2B or B2C)
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                    {userType === 'vendor' && (
                      <Box sx={{ ml: 4, mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Select Vendor Type:
                        </Typography>
                        <RadioGroup
                          name="vendor-type"
                          value={vendorType}
                          onChange={handleVendorTypeChange}
                          sx={{ gap: 1 }}
                        >
                          <FormControlLabel
                            value="b2b"
                            control={<Radio color="primary" size="small" />}
                            label={
                              <Typography variant="body2">B2B (Business-to-Business)</Typography>
                            }
                          />
                          <FormControlLabel
                            value="b2c"
                            control={<Radio color="primary" size="small" />}
                            label={
                              <Typography variant="body2">B2C (Business-to-Consumer)</Typography>
                            }
                          />
                        </RadioGroup>
                      </Box>
                    )}
                  </Card>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: userType === 'business' ? 'primary.main' : 'divider',
                      backgroundColor: userType === 'business' ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value="business"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">Business</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Manage your business account
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Card>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: userType === 'freelancer' ? 'primary.main' : 'divider',
                      backgroundColor: userType === 'freelancer' ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value="freelancer"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">Freelancer</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Manage your freelancer account
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Card>
                </RadioGroup>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!userType || (userType === 'vendor' && !vendorType)}
                    sx={{ width: '100%' }}
                  >
                    Continue
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h5" component="h2" gutterBottom align="center">
                  {activeTab === 'login'
                    ? `${userType.charAt(0).toUpperCase() + userType.slice(1)}${
                        userType === 'vendor' ? ` (${vendorType.toUpperCase()})` : ''
                      } Login`
                    : 'Customer Registration'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  {activeTab === 'register' && (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="name"
                          label="Full Name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          error={!!errors.name}
                          helperText={errors.name || 'Enter your full name'}
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="dateOfBirth"
                          label="Date of Birth"
                          type="date"
                          id="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          error={!!errors.dateOfBirth}
                          helperText={errors.dateOfBirth || 'Enter your date of birth (YYYY-MM-DD)'}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          margin="normal"
                          fullWidth
                          name="mobileNumber"
                          label="Mobile Number (Optional)"
                          type="tel"
                          id="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          error={!!errors.mobileNumber}
                          helperText={errors.mobileNumber || 'Enter your mobile number'}
                        />
                      </Box>
                    </>
                  )}
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={formData.email}
                      onChange={handleInputChange}
                      error={!!errors.email}
                      helperText={errors.email || 'Enter your email address'}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      error={!!errors.password}
                      helperText={errors.password || 'Password must be at least 6 characters'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {activeTab === 'register' && (
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword || 'Re-enter your password'}
                      />
                    </Box>
                  )}
                  {activeTab === 'login' && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="Remember me"
                    />
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {activeTab === 'login' ? 'Login' : 'Register'}
                    </Button>
                  </Box>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    {activeTab === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <Link
                          component="button"
                          type="button"
                          onClick={() => {
                            setActiveTab('register');
                            setUserType('customer');
                            setActiveStep(1); // Skip to registration form
                          }}
                          underline="hover"
                        >
                          Register as Customer
                        </Link>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <Link
                          component="button"
                          type="button"
                          onClick={() => setActiveTab('login')}
                          underline="hover"
                        >
                          Login
                        </Link>
                      </>
                    )}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    <Link href="/admin-login" underline="hover">
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