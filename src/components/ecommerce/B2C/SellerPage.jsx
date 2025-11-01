import React, { useState, useEffect } from 'react';
import {
  FiArrowRight, FiArrowLeft, FiCheck, FiUpload, FiPhone, FiShield,
} from 'react-icons/fi';
import { LockOutlined, UserOutlined, UploadOutlined, SafetyCertificateOutlined, BankOutlined, FileTextOutlined, ShopOutlined, PhoneOutlined, EnvironmentOutlined, TagsOutlined, TruckOutlined, MailOutlined, IdcardOutlined, GlobalOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  Form, Input, Button, Select, Card, Upload, Row, Col, Divider, Alert, Checkbox, Typography, Progress, Steps, TreeSelect,
} from 'antd';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step: AntStep } = Steps;

const registerVendor = async (data) => {
  const formData = new FormData();
  // =============== BASIC DETAILS ===============
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('confirmPassword', data.confirmPassword);
  formData.append('full_name', data.fullName);
  formData.append('mobile', `${data.countryCode}${data.mobile}`);
  formData.append('is_mobile_verified', data.mobileVerified ? 'true' : 'false');
  formData.append('meta.agreed_to_terms', data.agreedToTerms ? 'true' : 'false');
  // =============== STORE DETAILS ===============
  formData.append('store_details.store_name', data.store_details.store_name || '');
  formData.append('store_details.store_description', data.store_details.store_description || '');
  formData.append('store_details.store_type', data.store_details.store_type || '');
  formData.append('store_details.store_address', data.store_details.store_address || '');
  formData.append('store_details.pincode', data.store_details.pincode || '');
  formData.append('store_details.website', data.store_details.website || '');
  (data.store_details.categories || []).forEach((cat, i) => {
    formData.append(`store_details.categories[${i}]`, cat);
  });
  Object.entries(data.store_details.social_links || {}).forEach(([key, value]) => {
    formData.append(`store_details.social_links[${key}]`, value || '');
  });
  // 🖼️ Single logo file
  if (data.store_details.logo?.originFileObj) {
    formData.append('logo', data.store_details.logo.originFileObj);
  }
  // =============== REGISTRATION ===============
  formData.append('registration.pan_number', data.registration.pan_number || '');
  formData.append('registration.gstin', data.registration.gstin || '');
  formData.append('registration.business_license_number', data.registration.business_license_number || '');
  if (data.registration.shop_act_license?.originFileObj) {
    formData.append('registration.shop_act_license', data.registration.shop_act_license.originFileObj);
  }
  // =============== BANK DETAILS ===============
  formData.append('bank_details.bank_account_number', data.bank_details.bank_account_number || '');
  formData.append('bank_details.ifsc_code', data.bank_details.ifsc_code || '');
  formData.append('bank_details.account_holder_name', data.bank_details.account_holder_name || '');
  formData.append('bank_details.upi_id', data.bank_details.upi_id || '');
  formData.append('bank_details.preferred_currency', data.bank_details.preferred_currency || 'INR');
  // =============== CONTACTS ===============
  Object.entries(data.contacts || {}).forEach(([contactType, contactInfo]) => {
    Object.entries(contactInfo || {}).forEach(([key, value]) => {
      formData.append(`contacts.${contactType}[${key}]`, value || '');
    });
  });
  // =============== OPERATIONS ===============
  (data.operations.delivery_modes || []).forEach((mode, i) => {
    formData.append(`operations.delivery_modes[${i}]`, mode);
  });
  formData.append('operations.return_policy', data.operations.return_policy || '');
  formData.append('operations.avg_delivery_time_days', data.operations.avg_delivery_time_days || 0);
  // =============== DOCUMENTS (flat keys) ===============
  if (data.documents.identity_proof?.originFileObj) {
    formData.append('identityProof', data.documents.identity_proof.originFileObj);
  }
  if (data.documents.address_proof?.originFileObj) {
    formData.append('addressProof', data.documents.address_proof.originFileObj);
  }
  if (data.documents.gst_certificate?.originFileObj) {
    formData.append('gstCertificate', data.documents.gst_certificate.originFileObj);
  }
  (data.documents.additional || []).forEach((fileObj, i) => {
    if (fileObj?.originFileObj) {
      formData.append(`additional[${i}]`, fileObj.originFileObj);
    }
  });
  // =============== DEBUG OUTPUT ===============
  console.group('📦 FormData Preview');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.groupEnd();
  // =============== API REQUEST ===============
  const response = await axios.post('http://localhost:5000/api/vendor/b2c', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const SellerPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [form] = Form.useForm();
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState({
    'store_details.logo': [],
    'registration.shop_act_license': [],
    'documents.identity_proof': [],
    'documents.address_proof': [],
    'documents.gst_certificate': [],
    'documents.additional': [],
  });
  const [backendErrors, setBackendErrors] = useState({});

  const { control, handleSubmit, setValue, getValues, formState: { errors }, setError, reset, watch, trigger } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      mobile: '',
      countryCode: '+91',
      mobileVerified: false,
      store_details: {
        store_name: '',
        store_description: '',
        store_type: 'Individual / Sole Proprietor',
        store_address: '',
        pincode: '',
        website: '',
        logo: null,
        categories: [],
        social_links: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
        },
      },
      registration: {
        pan_number: '',
        gstin: '',
        business_license_number: '',
        shop_act_license: null,
      },
      bank_details: {
        bank_account_number: '',
        ifsc_code: '',
        account_holder_name: '',
        upi_id: '',
        preferred_currency: 'INR',
      },
      contacts: {
        primary_contact: {
          name: '',
          designation: '',
          email: '',
          mobile: '',
          whatsapp: '',
        },
        support_contact: {
          name: '',
          designation: '',
          email: '',
          mobile: '',
          whatsapp: '',
        },
      },
      operations: {
        delivery_modes: [],
        return_policy: '',
        avg_delivery_time_days: 0,
      },
      documents: {
        identity_proof: null,
        address_proof: null,
        gst_certificate: null,
        additional: [],
      },
      agreedToTerms: false,
    },
    mode: 'onChange',
    resolver: async (data) => {
      const errors = {};
      if (!data.email) errors.email = { message: 'Email is required' };
      if (!data.password) errors.password = { message: 'Password is required' };
      if (data.password && data.password.length < 6) errors.password = { message: 'Password must be at least 6 characters' };
      if (!data.confirmPassword) errors.confirmPassword = { message: 'Confirm password is required' };
      if (data.password !== data.confirmPassword) errors.confirmPassword = { message: 'Passwords do not match' };
      if (!data.fullName) errors.fullName = { message: 'Full name is required' };
      if (!data.store_details.store_name) errors.store_details = { store_name: { message: 'Store name is required' } };
      if (!data.store_details.store_type) errors.store_details = { ...errors.store_details, store_type: { message: 'Store type is required' } };
      if (!data.mobile) errors.mobile = { message: 'Mobile number is required' };
      if (data.mobile && !/^\d{10}$/.test(data.mobile)) errors.mobile = { message: 'Mobile number must be 10 digits' };
      if (!data.store_details.store_address) errors.store_details = { ...errors.store_details, store_address: { message: 'Store address is required' } };
      if (!data.store_details.pincode) errors.store_details = { ...errors.store_details, pincode: { message: 'Pincode is required' } };
      if (!data.registration.pan_number) errors.registration = { pan_number: { message: 'PAN number is required' } };
      if (!data.bank_details.account_holder_name) errors.bank_details = { account_holder_name: { message: 'Account holder name is required' } };
      if (!data.bank_details.bank_account_number) errors.bank_details = { ...errors.bank_details, bank_account_number: { message: 'Bank account number is required' } };
      if (!data.bank_details.ifsc_code) errors.bank_details = { ...errors.bank_details, ifsc_code: { message: 'IFSC code is required' } };
      if (!data.documents.identity_proof) errors.documents = { identity_proof: { message: 'Identity proof is required' } };
      if (!data.documents.address_proof) errors.documents = { ...errors.documents, address_proof: { message: 'Address proof is required' } };
      if (!data.store_details.categories.length) errors.store_details = { ...errors.store_details, categories: { message: 'At least one category is required' } };
      if (!data.operations.return_policy) errors.operations = { return_policy: { message: 'Return policy is required' } };
      if (!data.agreedToTerms) errors.agreedToTerms = { message: 'You must agree to the terms' };
      return { values: Object.keys(errors).length ? {} : data, errors };
    },
  });

  // Watch form values for real-time validation feedback
  const watchedFields = watch();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data.hierarchy);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+971', country: 'UAE' },
  ];

  const mutation = useMutation({
    mutationFn: registerVendor,
    onSuccess: (response) => {
      console.log('✅ Vendor Registration Successful:', response);
      toast.success('Registration successful!');
      reset();
      navigate('/sawtar/login');
    },
    onError: (error) => {
      console.error('❌ Vendor Registration Error:', error);
      if (error.response) {
        console.group('📡 Backend Error Response');
        console.log('🔗 Status:', error.response.status);
        console.log('🧾 Data:', error.response.data);
        console.groupEnd();
      } else {
        console.warn('⚠️ No response from server (network error or CORS issue)');
      }
      if (error.response?.data?.errors) {
        const errorMap = {};
        error.response.data.errors.forEach(({ field, message }) => {
          errorMap[field] = message;
          setError(field, { type: 'server', message });
        });
        setBackendErrors(errorMap);
        toast.error('Please correct the highlighted errors');
      } else {
        const msg = error.response?.data?.message || 'Unexpected registration error';
        setError('root', { message: msg });
        toast.error(msg);
      }
    },
  });

  const handleFileChange = (field, { fileList }) => {
    // For single-file fields, take the latest file
    if (field !== 'documents.additional') {
      const latestFile = fileList.length > 0 ? fileList[fileList.length - 1] : null;
      setValue(field, latestFile, { shouldValidate: true });
      setFileList(prev => ({
        ...prev,
        [field]: latestFile ? [latestFile] : [],
      }));
    } else {
      // For multiple files (documents.additional)
      setValue(field, fileList, { shouldValidate: true });
      setFileList(prev => ({
        ...prev,
        [field]: fileList,
      }));
    }
    trigger(field); // Trigger validation after file change
  };

  const uploadProps = (field) => ({
    beforeUpload: () => false, // Prevent automatic upload
    fileList: fileList[field],
    multiple: field === 'documents.additional',
    onChange: (info) => handleFileChange(field, info),
    accept: 'image/*,application/pdf', // Restrict to images and PDFs
    maxCount: field === 'documents.additional' ? 5 : 1, // Limit additional documents to 5
    onRemove: (file) => {
      const updatedFileList = fileList[field].filter(item => item.uid !== file.uid);
      setFileList(prev => ({
        ...prev,
        [field]: updatedFileList,
      }));
      setValue(field, field === 'documents.additional' ? updatedFileList : null, { shouldValidate: true });
      trigger(field);
    },
    onPreview: async (file) => {
      // Preview file in a new tab
      if (file.url || file.preview) {
        window.open(file.url || file.preview);
      } else if (file.originFileObj) {
        const url = URL.createObjectURL(file.originFileObj);
        window.open(url);
      }
    },
  });

  const sendOtp = async () => {
    const mobile = getValues('mobile');
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setError('mobile', { type: 'manual', message: 'Invalid mobile number' });
      return toast.error('Invalid mobile number');
    }
    const fullMobile = `${countryCode}${mobile}`;
    try {
      await axios.post('http://localhost:5000/api/auth/otp/send', { mobile: fullMobile });
      setOtpSent(true);
      toast.success('OTP sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    const mobile = getValues('mobile');
    if (!otp || !/^\d{4,6}$/.test(otp)) {
      toast.error('Invalid OTP');
      return;
    }
    const fullMobile = `${countryCode}${mobile}`;
    try {
      await axios.post('http://localhost:5000/api/auth/otp/verify', { mobile: fullMobile, otp });
      setMobileVerified(true);
      setValue('mobileVerified', true, { shouldValidate: true });
      toast.success('Mobile verified!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error verifying OTP');
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      0: ['email', 'password', 'confirmPassword'],
      1: ['fullName', 'store_details.store_name', 'store_details.store_type'],
      2: ['mobile', 'store_details.store_address', 'store_details.pincode'],
      3: ['registration.pan_number'],
      4: ['bank_details.account_holder_name', 'bank_details.bank_account_number', 'bank_details.ifsc_code'],
      5: ['documents.identity_proof', 'documents.address_proof'],
      6: ['store_details.categories'],
      7: ['operations.return_policy'],
      8: ['agreedToTerms'],
    };
    try {
      await trigger(fieldsToValidate[activeStep]);
      if (Object.keys(errors).length === 0) {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        setBackendErrors({});
      } else {
        toast.error('Please fill all required fields correctly');
      }
    } catch (error) {
      toast.error('Validation failed. Please check your inputs.');
    }
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    setBackendErrors({});
  };

  const onSubmit = async (data) => {
    if (!mobileVerified) {
      toast.error('Please verify your mobile number');
      return;
    }
    if (!data.documents.identity_proof || !data.documents.address_proof) {
      toast.error('Required documents missing');
      return;
    }
    if (!data.agreedToTerms) {
      setError('agreedToTerms', { type: 'manual', message: 'You must agree to the terms and conditions' });
      toast.error('You must agree to the terms and conditions');
      return;
    }
    mutation.mutate({ ...data, countryCode, mobileVerified });
  };

  const steps = [
    { label: 'Account Setup', icon: <UserOutlined />, description: 'Create your vendor account' },
    { label: 'Business Info', icon: <ShopOutlined />, description: 'Store details & branding' },
    { label: 'Contact & Address', icon: <PhoneOutlined />, description: 'Location & contacts' },
    { label: 'Tax & Registration', icon: <FileTextOutlined />, description: 'Legal documents' },
    { label: 'Bank Details', icon: <BankOutlined />, description: 'Payment information' },
    { label: 'Documents', icon: <UploadOutlined />, description: 'Upload required files' },
    { label: 'Categories', icon: <TagsOutlined />, description: 'Product catalog setup' },
    { label: 'Operations', icon: <TruckOutlined />, description: 'Delivery & policies' },
    { label: 'Agreement', icon: <SafetyCertificateOutlined />, description: 'Terms & verification' },
  ];

  const renderSuccessIndicator = (field) => {
    return !errors[field] && watchedFields[field] ? <CheckCircleOutlined className="text-green-600 ml-2" /> : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <ShopOutlined className="text-white text-xl" />
            </div>
            <Title level={1} className="text-4xl font-bold text-gray-900 mb-0">
              Vendor Registration
            </Title>
          </div>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join Sawtar LuxeInteriors as a premium vendor. Complete the registration process to start selling your products.
          </Text>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Stepper */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border-0 rounded-2xl" bodyStyle={{ padding: '24px' }}>
              <div className="text-center mb-6">
                <Progress
                  type="circle"
                  percent={Math.round((activeStep / (steps.length - 1)) * 100)}
                  width={80}
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                  format={percent => `${percent}%`}
                />
                <Text className="block mt-2 text-gray-600 font-medium">Progress</Text>
              </div>
              <Steps direction="vertical" current={activeStep} size="small">
                {steps.map((step, index) => (
                  <AntStep
                    key={step.label}
                    title={<Text className={index <= activeStep ? 'text-blue-600 font-medium' : 'text-gray-500'}>{step.label}</Text>}
                    description={<Text className="text-xs text-gray-400">{step.description}</Text>}
                    icon={step.icon}
                  />
                ))}
              </Steps>
            </Card>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Form form={form} layout="vertical" onFinish={handleSubmit(onSubmit)} className="h-full">
              <Card className="shadow-2xl border-0 rounded-2xl h-full" bodyStyle={{ padding: '32px' }}>
                <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  {/* Step 1: Account Setup */}
                  {activeStep === 0 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <UserOutlined className="mr-3 text-blue-600" /> Account Setup
                        </Title>
                        <Text className="text-gray-600">Create your secure vendor account</Text>
                      </div>
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            label={<span>Email Address <span className="text-red-500">*</span></span>}
                            validateStatus={errors.email || backendErrors.email ? 'error' : ''}
                            help={errors.email?.message || backendErrors.email}
                          >
                            <Controller
                              name="email"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  prefix={<MailOutlined className="text-gray-400" />}
                                  placeholder="Enter your business email"
                                  suffix={renderSuccessIndicator('email')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Password <span className="text-red-500">*</span></span>}
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password?.message}
                          >
                            <Controller
                              name="password"
                              control={control}
                              render={({ field }) => (
                                <Input.Password
                                  {...field}
                                  size="large"
                                  prefix={<LockOutlined className="text-gray-400" />}
                                  placeholder="Create a strong password"
                                  suffix={renderSuccessIndicator('password')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Confirm Password <span className="text-red-500">*</span></span>}
                            validateStatus={errors.confirmPassword ? 'error' : ''}
                            help={errors.confirmPassword?.message}
                          >
                            <Controller
                              name="confirmPassword"
                              control={control}
                              render={({ field }) => (
                                <Input.Password
                                  {...field}
                                  size="large"
                                  prefix={<LockOutlined className="text-gray-400" />}
                                  placeholder="Confirm your password"
                                  suffix={renderSuccessIndicator('confirmPassword')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  )}
                  {/* Step 2: Business Information */}
                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <ShopOutlined className="mr-3 text-green-600" /> Business Information
                        </Title>
                        <Text className="text-gray-600">Tell us about your business</Text>
                      </div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Full Name <span className="text-red-500">*</span></span>}
                            validateStatus={errors.fullName ? 'error' : ''}
                            help={errors.fullName?.message}
                          >
                            <Controller
                              name="fullName"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  prefix={<UserOutlined className="text-gray-400" />}
                                  placeholder="Your full name"
                                  suffix={renderSuccessIndicator('fullName')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Store Name <span className="text-red-500">*</span></span>}
                            validateStatus={errors.store_details?.store_name ? 'error' : ''}
                            help={errors.store_details?.store_name?.message}
                          >
                            <Controller
                              name="store_details.store_name"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  prefix={<ShopOutlined className="text-gray-400" />}
                                  placeholder="Your store name"
                                  suffix={renderSuccessIndicator('store_details.store_name')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Store Description">
                        <Controller
                          name="store_details.store_description"
                          control={control}
                          render={({ field }) => (
                            <TextArea
                              {...field}
                              rows={4}
                              placeholder="Describe your business and products..."
                              className="rounded-lg"
                            />
                          )}
                        />
                      </Form.Item>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Store Type <span className="text-red-500">*</span></span>}
                            validateStatus={errors.store_details?.store_type ? 'error' : ''}
                            help={errors.store_details?.store_type?.message}
                          >
                            <Controller
                              name="store_details.store_type"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  size="large"
                                  placeholder="Select store type"
                                  className="rounded-lg"
                                >
                                  <Option value="Individual / Sole Proprietor">Individual / Sole Proprietor</Option>
                                  <Option value="Private Limited">Private Limited</Option>
                                  <Option value="Partnership">Partnership</Option>
                                  <Option value="LLP">LLP</Option>
                                </Select>
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Website">
                            <Controller
                              name="store_details.website"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  prefix={<GlobalOutlined className="text-gray-400" />}
                                  placeholder="https://yourstore.com"
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Store Logo">
                        <Controller
                          name="store_details.logo"
                          control={control}
                          render={({ field }) => (
                            <Upload {...uploadProps('store_details.logo')}>
                              <Button icon={<UploadOutlined />} size="large" className="rounded-lg">
                                Upload Logo
                              </Button>
                            </Upload>
                          )}
                        />
                        {fileList['store_details.logo'].length > 0 && (
                          <Alert message={fileList['store_details.logo'][0].name} type="success" showIcon className="mt-2" />
                        )}
                      </Form.Item>
                    </div>
                  )}
                  {/* Step 3: Contact & Address */}
                  {activeStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <PhoneOutlined className="mr-3 text-orange-600" /> Contact & Address
                        </Title>
                        <Text className="text-gray-600">Your business location and contact information</Text>
                      </div>
                      <Alert
                        message="Mobile Verification Required"
                        description="You need to verify your mobile number to complete registration"
                        type="warning"
                        showIcon
                        className="mb-6"
                      />
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="Country Code">
                            <Select
                              size="large"
                              value={countryCode}
                              onChange={(value) => { setCountryCode(value); setValue('countryCode', value); }}
                              className="rounded-lg"
                            >
                              {countryCodes.map(({ code, country }) => (
                                <Option key={code} value={code}>
                                  {country} ({code})
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            label={<span>Mobile Number <span className="text-red-500">*</span></span>}
                            validateStatus={errors.mobile || backendErrors.mobile ? 'error' : ''}
                            help={errors.mobile?.message || backendErrors.mobile}
                          >
                            <Controller
                              name="mobile"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  prefix={<PhoneOutlined className="text-gray-400" />}
                                  placeholder="10-digit mobile number"
                                  suffix={renderSuccessIndicator('mobile')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label=" ">
                            {!otpSent && !mobileVerified && (
                              <Button
                                type="primary"
                                size="large"
                                onClick={sendOtp}
                                className="w-full rounded-lg h-10"
                              >
                                Send OTP
                              </Button>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      {otpSent && !mobileVerified && (
                        <Row gutter={16}>
                          <Col span={16}>
                            <Form.Item label="Enter OTP">
                              <Input
                                size="large"
                                placeholder="Enter OTP received"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="rounded-lg"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label=" ">
                              <Button
                                type="primary"
                                size="large"
                                onClick={verifyOtp}
                                className="w-full rounded-lg h-10"
                              >
                                Verify OTP
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                      {mobileVerified && (
                        <Alert
                          message="Mobile Number Verified"
                          description="Your mobile number has been successfully verified"
                          type="success"
                          showIcon
                          className="mb-4"
                        />
                      )}
                      <Form.Item
                        label={<span>Store Address <span className="text-red-500">*</span></span>}
                        validateStatus={errors.store_details?.store_address ? 'error' : ''}
                        help={errors.store_details?.store_address?.message}
                      >
                        <Controller
                          name="store_details.store_address"
                          control={control}
                          render={({ field }) => (
                            <TextArea
                              {...field}
                              rows={3}
                              placeholder="Complete business address"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </Form.Item>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Pincode <span className="text-red-500">*</span></span>}
                            validateStatus={errors.store_details?.pincode ? 'error' : ''}
                            help={errors.store_details?.pincode?.message}
                          >
                            <Controller
                              name="store_details.pincode"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  prefix={<EnvironmentOutlined className="text-gray-400" />}
                                  placeholder="Enter pincode"
                                  suffix={renderSuccessIndicator('store_details.pincode')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider orientation="left">Contact Persons</Divider>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Card size="small" title="Primary Contact" className="rounded-lg">
                            <Controller
                              name="contacts.primary_contact.name"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Name" className="rounded-lg mb-2" />
                              )}
                            />
                            <Controller
                              name="contacts.primary_contact.designation"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Designation" className="rounded-lg mb-2" />
                              )}
                            />
                            <Controller
                              name="contacts.primary_contact.email"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Email" className="rounded-lg mb-2" />
                              )}
                            />
                            <Controller
                              name="contacts.primary_contact.mobile"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Mobile" className="rounded-lg" />
                              )}
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" title="Support Contact" className="rounded-lg">
                            <Controller
                              name="contacts.support_contact.name"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Name" className="rounded-lg mb-2" />
                              )}
                            />
                            <Controller
                              name="contacts.support_contact.designation"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Designation" className="rounded-lg mb-2" />
                              )}
                            />
                            <Controller
                              name="contacts.support_contact.email"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Email" className="rounded-lg mb-2" />
                              )}
                            />
                            <Controller
                              name="contacts.support_contact.mobile"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="Mobile" className="rounded-lg" />
                              )}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )}
                  {/* Step 4: Tax & Registration */}
                  {activeStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <FileTextOutlined className="mr-3 text-purple-600" /> Tax & Registration
                        </Title>
                        <Text className="text-gray-600">Legal and tax registration details</Text>
                      </div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={<span>PAN Number <span className="text-red-500">*</span></span>}
                            validateStatus={errors.registration?.pan_number ? 'error' : ''}
                            help={errors.registration?.pan_number?.message}
                          >
                            <Controller
                              name="registration.pan_number"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  prefix={<IdcardOutlined className="text-gray-400" />}
                                  placeholder="Enter PAN number"
                                  suffix={renderSuccessIndicator('registration.pan_number')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="GSTIN">
                            <Controller
                              name="registration.gstin"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  placeholder="Enter GSTIN"
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Business License Number">
                        <Controller
                          name="registration.business_license_number"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              size="large"
                              placeholder="Business license number"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </Form.Item>
                      <Form.Item label="Shop Act License">
                        <Controller
                          name="registration.shop_act_license"
                          control={control}
                          render={({ field }) => (
                            <Upload {...uploadProps('registration.shop_act_license')}>
                              <Button icon={<UploadOutlined />} size="large" className="rounded-lg">
                                Upload License
                              </Button>
                            </Upload>
                          )}
                        />
                        {fileList['registration.shop_act_license'].length > 0 && (
                          <Alert message={fileList['registration.shop_act_license'][0].name} type="success" showIcon className="mt-2" />
                        )}
                      </Form.Item>
                    </div>
                  )}
                  {/* Step 5: Bank Details */}
                  {activeStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <BankOutlined className="mr-3 text-green-600" /> Bank Details
                        </Title>
                        <Text className="text-gray-600">Payment and bank account information</Text>
                      </div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Account Holder Name <span className="text-red-500">*</span></span>}
                            validateStatus={errors.bank_details?.account_holder_name ? 'error' : ''}
                            help={errors.bank_details?.account_holder_name?.message}
                          >
                            <Controller
                              name="bank_details.account_holder_name"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  placeholder="Name as in bank account"
                                  suffix={renderSuccessIndicator('bank_details.account_holder_name')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={<span>Bank Account Number <span className="text-red-500">*</span></span>}
                            validateStatus={errors.bank_details?.bank_account_number ? 'error' : ''}
                            help={errors.bank_details?.bank_account_number?.message}
                          >
                            <Controller
                              name="bank_details.bank_account_number"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  placeholder="Account number"
                                  suffix={renderSuccessIndicator('bank_details.bank_account_number')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={<span>IFSC Code <span className="text-red-500">*</span></span>}
                            validateStatus={errors.bank_details?.ifsc_code ? 'error' : ''}
                            help={errors.bank_details?.ifsc_code?.message}
                          >
                            <Controller
                              name="bank_details.ifsc_code"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  placeholder="IFSC code"
                                  suffix={renderSuccessIndicator('bank_details.ifsc_code')}
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="UPI ID">
                            <Controller
                              name="bank_details.upi_id"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  size="large"
                                  placeholder="UPI ID for payments"
                                  className="rounded-lg"
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Preferred Currency">
                        <Controller
                          name="bank_details.preferred_currency"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              size="large"
                              defaultValue="INR"
                              className="rounded-lg"
                            >
                              <Option value="INR">Indian Rupee (INR)</Option>
                              <Option value="USD">US Dollar (USD)</Option>
                              <Option value="EUR">Euro (EUR)</Option>
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </div>
                  )}
                  {/* Step 6: Documents Upload */}
                  {activeStep === 5 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <UploadOutlined className="mr-3 text-blue-600" /> Documents Upload
                        </Title>
                        <Text className="text-gray-600">Upload required documents for verification</Text>
                      </div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Card size="small" title={<span>Identity Proof <span className="text-red-500">*</span></span>} className="rounded-lg h-full">
                            <Controller
                              name="documents.identity_proof"
                              control={control}
                              render={({ field }) => (
                                <Upload {...uploadProps('documents.identity_proof')}>
                                  <Button icon={<UploadOutlined />} size="large" className="rounded-lg w-full">
                                    Upload Identity Proof
                                  </Button>
                                </Upload>
                              )}
                            />
                            {fileList['documents.identity_proof'].length > 0 && (
                              <Alert message={fileList['documents.identity_proof'][0].name} type="success" showIcon className="mt-2" />
                            )}
                            {errors.documents?.identity_proof && (
                              <Text type="danger">{errors.documents.identity_proof.message}</Text>
                            )}
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" title={<span>Address Proof <span className="text-red-500">*</span></span>} className="rounded-lg h-full">
                            <Controller
                              name="documents.address_proof"
                              control={control}
                              render={({ field }) => (
                                <Upload {...uploadProps('documents.address_proof')}>
                                  <Button icon={<UploadOutlined />} size="large" className="rounded-lg w-full">
                                    Upload Address Proof
                                  </Button>
                                </Upload>
                              )}
                            />
                            {fileList['documents.address_proof'].length > 0 && (
                              <Alert message={fileList['documents.address_proof'][0].name} type="success" showIcon className="mt-2" />
                            )}
                            {errors.documents?.address_proof && (
                              <Text type="danger">{errors.documents.address_proof.message}</Text>
                            )}
                          </Card>
                        </Col>
                      </Row>
                      <Row gutter={16} className="mt-4">
                        <Col span={12}>
                          <Card size="small" title="GST Certificate" className="rounded-lg h-full">
                            <Controller
                              name="documents.gst_certificate"
                              control={control}
                              render={({ field }) => (
                                <Upload {...uploadProps('documents.gst_certificate')}>
                                  <Button icon={<UploadOutlined />} size="large" className="rounded-lg w-full">
                                    Upload GST Certificate
                                  </Button>
                                </Upload>
                              )}
                            />
                            {fileList['documents.gst_certificate'].length > 0 && (
                              <Alert message={fileList['documents.gst_certificate'][0].name} type="success" showIcon className="mt-2" />
                            )}
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" title="Additional Documents" className="rounded-lg h-full">
                            <Controller
                              name="documents.additional"
                              control={control}
                              render={({ field }) => (
                                <Upload {...uploadProps('documents.additional')}>
                                  <Button icon={<UploadOutlined />} size="large" className="rounded-lg w-full">
                                    Upload Additional Files
                                  </Button>
                                </Upload>
                              )}
                            />
                            {fileList['documents.additional'].length > 0 && (
                              <div className="mt-2">
                                {fileList['documents.additional'].map((file, idx) => (
                                  <Alert key={idx} message={file.name} type="info" showIcon className="mb-1" />
                                ))}
                              </div>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )}
                  {/* Step 7: Product Categories */}
                  {activeStep === 6 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <TagsOutlined className="mr-3 text-orange-600" /> Product Categories
                        </Title>
                        <Text className="text-gray-600">Select your product categories</Text>
                      </div>
                      <Form.Item
                        label={<span>Categories <span className="text-red-500">*</span></span>}
                        validateStatus={errors.store_details?.categories ? 'error' : ''}
                        help={errors.store_details?.categories?.message}
                      >
                        <Controller
                          name="store_details.categories"
                          control={control}
                          render={({ field }) => (
                            <TreeSelect
                              {...field}
                              size="large"
                              treeData={categories.map(category => ({
                                title: category.name,
                                value: category._id,
                                children: category.children.map(child => ({
                                  title: child.name,
                                  value: child._id,
                                })),
                              }))}
                              multiple
                              treeCheckable
                              placeholder="Select categories"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </Form.Item>
                    </div>
                  )}
                  {/* Step 8: Operations */}
                  {activeStep === 7 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <TruckOutlined className="mr-3 text-cyan-600" /> Operations
                        </Title>
                        <Text className="text-gray-600">Configure your delivery and return policies</Text>
                      </div>
                      <Form.Item
                        label={<span>Return Policy <span className="text-red-500">*</span></span>}
                        validateStatus={errors.operations?.return_policy ? 'error' : ''}
                        help={errors.operations?.return_policy?.message}
                      >
                        <Controller
                          name="operations.return_policy"
                          control={control}
                          render={({ field }) => (
                            <TextArea
                              {...field}
                              rows={4}
                              placeholder="Describe your return policy, including time frames, conditions, and process..."
                              className="rounded-lg"
                            />
                          )}
                        />
                      </Form.Item>
                      <Form.Item label="Average Delivery Time (days)">
                        <Controller
                          name="operations.avg_delivery_time_days"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              placeholder="Estimated delivery time in days"
                              className="rounded-lg"
                            />
                          )}
                        />
                      </Form.Item>
                    </div>
                  )}
                  {/* Step 9: Agreement & Verification */}
                  {activeStep === 8 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Title level={2} className="text-2xl font-bold text-gray-900">
                          <SafetyCertificateOutlined className="mr-3 text-green-600" /> Agreement & Verification
                        </Title>
                        <Text className="text-gray-600">Review and submit your application</Text>
                      </div>
                      <Alert
                        message="Final Verification"
                        description="Please review all information before submission. You will receive confirmation within 24-48 hours."
                        type="info"
                        showIcon
                        className="mb-6"
                      />
                      <Card className="rounded-lg">
                        <div className="mb-6">
                          <Title level={4}>Terms & Conditions</Title>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                            <Text className="text-gray-700">
                              By proceeding, you agree to our Vendor Agreement, Terms of Service, and Privacy Policy.
                              You confirm that all information provided is accurate and complete. You understand that:
                              <br /><br />
                              • You are responsible for the quality and authenticity of your products
                              <br />
                              • You will maintain adequate inventory levels
                              <br />
                              • You will process orders within the specified timeframes
                              <br />
                              • You comply with all applicable laws and regulations
                              <br />
                              • Sawtar LuxeInteriors may verify provided information
                              <br />
                              • Approval is subject to verification and compliance checks
                            </Text>
                          </div>
                        </div>
                        <Form.Item
                          validateStatus={errors.agreedToTerms ? 'error' : ''}
                          help={errors.agreedToTerms?.message}
                        >
                          <Controller
                            name="agreedToTerms"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                {...field}
                                checked={field.value}
                                className="text-gray-700"
                              >
                                I have read and agree to the Terms and Conditions, Privacy Policy, and Vendor Agreement <span className="text-red-500">*</span>
                              </Checkbox>
                            )}
                          />
                        </Form.Item>
                        <Divider />
                        <div className="text-center">
                          <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={mutation.isLoading}
                            className="rounded-lg h-12 px-8 bg-green-600 hover:bg-green-700 border-none"
                            icon={<CheckCircleOutlined />}
                          >
                            {mutation.isLoading ? 'Submitting...' : 'Submit for Verification'}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                </motion.div>
                {/* Navigation Buttons */}
                <Divider />
                <div className="flex justify-between mt-8">
                  <Button
                    size="large"
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    icon={<FiArrowLeft />}
                    className="rounded-lg px-6 h-10"
                  >
                    Previous
                  </Button>
                  {activeStep < steps.length - 1 && (
                    <Button
                      type="primary"
                      size="large"
                      onClick={nextStep}
                      icon={<FiArrowRight />}
                      className="rounded-lg px-6 h-10 bg-blue-600 hover:bg-blue-700 border-none"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;