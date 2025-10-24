import React, { useState, useRef } from 'react';
import { 
  FiArrowRight, FiArrowLeft, FiCheck, FiBriefcase, 
  FiDollarSign, FiUser, FiLock, FiFileText, FiUpload,
  FiMapPin, FiHash, FiEdit2, FiX, FiPhone, FiShield,
  FiGlobe, FiInfo, FiTruck, FiLink
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form'; // Keep react-hook-form for form management, but no validation
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Error mapping function
export function applyBackendErrors(errors, setError) {
  errors.forEach(({ field, message }) => {
    setError(field, { type: 'server', message });
  });
}

// Default values
const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  mobile: '',
  store_details: {
    store_name: '',
    store_description: '',
    store_type: 'Individual / Sole Proprietor',
    store_address: '',
    pincode: '',
    website: '',
    logo: null,
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
    additional: []
  },
  categories: [],
  agreedToTerms: false,
};

// Backend mutation
const registerVendor = async (data) => {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('full_name', data.fullName);
  formData.append('mobile', `${data.countryCode}${data.mobile}`);
  formData.append('is_mobile_verified', data.mobileVerified ? 'true' : 'false');
  formData.append('store_details', JSON.stringify(data.store_details));
  formData.append('registration', JSON.stringify(data.registration));
  formData.append('bank_details', JSON.stringify(data.bank_details));
  formData.append('contacts', JSON.stringify(data.contacts));
  formData.append('operations', JSON.stringify(data.operations));
  formData.append('categories', JSON.stringify(data.categories));
  formData.append('agreed_to_terms', data.agreedToTerms ? 'true' : 'false');

  // Files
  if (data.store_details.logo) formData.append('logo', data.store_details.logo);
  if (data.registration.shop_act_license) formData.append('shop_act_license', data.registration.shop_act_license);
  if (data.documents.identity_proof) formData.append('identityProof', data.documents.identity_proof);
  if (data.documents.address_proof) formData.append('addressProof', data.documents.address_proof);
  if (data.documents.gst_certificate) formData.append('gstCertificate', data.documents.gst_certificate);
  data.documents.additional.forEach(file => formData.append('additional', file));

  const response = await axios.post('http://localhost:5000/api/vendor/b2c', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const SellerPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [editingSubcategoryIndex, setEditingSubcategoryIndex] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [newDeliveryMode, setNewDeliveryMode] = useState('');
  const [editingDeliveryIndex, setEditingDeliveryIndex] = useState(null);

  const { control, handleSubmit, setValue, getValues, formState: { errors }, setError, reset } = useForm({
    defaultValues: { ...defaultValues, countryCode, mobileVerified },
    mode: 'onChange', // No resolver for validation
  });

  const logoRef = useRef(null);
  const shopActRef = useRef(null);
  const identityProofRef = useRef(null);
  const addressProofRef = useRef(null);
  const gstCertificateRef = useRef(null);

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+971', country: 'UAE' },
  ];

  const mutation = useMutation({
    mutationFn: registerVendor,
    onSuccess: () => {
      setShowSuccess(true);
      toast.success('Registration successful!');
      reset();
    },
    onError: (error) => {
      toast.error('Registration failed');
      if (error.response?.data?.errors) {
        applyBackendErrors(error.response.data.errors, setError);
      } else {
        setError('root', { message: error.response?.data?.message || error.message || 'Unexpected error' });
      }
    },
  });

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setValue(field, file, { shouldValidate: true });
    }
  };

  const sendOtp = async () => {
    const mobile = getValues('mobile');
    if (!mobile || !/^\d{10}$/.test(mobile)) return toast.error('Invalid mobile');
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
    if (!otp || !/^\d{4,6}$/.test(otp)) return toast.error('Invalid OTP');
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

  // Category management
  const addCategory = () => {
    if (!newCategory.trim()) return;
    const categories = getValues('categories') || [];
    setValue('categories', [...categories, { name: newCategory.trim(), subcategories: [] }], { shouldValidate: true });
    setNewCategory('');
  };

  const updateCategory = (index) => {
    if (!newCategory.trim()) return;
    const categories = getValues('categories');
    categories[index].name = newCategory.trim();
    setValue('categories', [...categories], { shouldValidate: true });
    setEditingCategoryIndex(null);
    setNewCategory('');
  };

  const removeCategory = (index) => {
    const categories = getValues('categories').filter((_, i) => i !== index);
    setValue('categories', categories, { shouldValidate: true });
  };

  const addSubcategory = (categoryIndex) => {
    if (!newSubcategory.trim()) return;
    const categories = getValues('categories');
    categories[categoryIndex].subcategories.push(newSubcategory.trim());
    setValue('categories', [...categories], { shouldValidate: true });
    setNewSubcategory('');
  };

  const updateSubcategory = (categoryIndex, subcategoryIndex) => {
    if (!newSubcategory.trim()) return;
    const categories = getValues('categories');
    categories[categoryIndex].subcategories[subcategoryIndex] = newSubcategory.trim();
    setValue('categories', [...categories], { shouldValidate: true });
    setEditingSubcategoryIndex(null);
    setNewSubcategory('');
  };

  const removeSubcategory = (categoryIndex, subcategoryIndex) => {
    const categories = getValues('categories');
    categories[categoryIndex].subcategories = categories[categoryIndex].subcategories.filter((_, i) => i !== subcategoryIndex);
    setValue('categories', [...categories], { shouldValidate: true });
  };

  // Delivery modes management
  const addDeliveryMode = () => {
    if (!newDeliveryMode.trim()) return;
    const deliveryModes = getValues('operations.delivery_modes') || [];
    setValue('operations.delivery_modes', [...deliveryModes, newDeliveryMode.trim()], { shouldValidate: true });
    setNewDeliveryMode('');
  };

  const updateDeliveryMode = (index) => {
    if (!newDeliveryMode.trim()) return;
    const deliveryModes = getValues('operations.delivery_modes');
    deliveryModes[index] = newDeliveryMode.trim();
    setValue('operations.delivery_modes', [...deliveryModes], { shouldValidate: true });
    setEditingDeliveryIndex(null);
    setNewDeliveryMode('');
  };

  const removeDeliveryMode = (index) => {
    const deliveryModes = getValues('operations.delivery_modes').filter((_, i) => i !== index);
    setValue('operations.delivery_modes', deliveryModes, { shouldValidate: true });
  };

  const nextStep = async () => {
    // No frontend validation - proceed directly
    setStep((prev) => Math.min(prev + 1, 10));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data) => {
    if (!mobileVerified) return toast.error('Verify mobile');
    if (!data.documents.identity_proof || !data.documents.address_proof) {
      return toast.error('Required documents missing');
    }
    mutation.mutate({ ...data, countryCode, mobileVerified });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your vendor account is created. Await verification.
          </p>
          <button
            onClick={() => navigate('/sawtar/login')}
            className="w-full px-6 py-3 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90 transition"
          >
            Login Now
          </button>
        </motion.div>
      </div>
    );
  }

  const steps = [
    {
      title: "Create Account",
      icon: <FiUser size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg text-blue-800 text-sm flex items-center">
            <FiShield className="mr-2" /> Secure your account with a strong password.
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address *</label>
            <input name="email" onChange={(e) => setValue('email', e.target.value)} type="email" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input name="password" onChange={(e) => setValue('password', e.target.value)} type="password" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
            <input name="confirmPassword" onChange={(e) => setValue('confirmPassword', e.target.value)} type="password" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
          </div>
        </div>
      ),
    },
    {
      title: "Business Information",
      icon: <FiBriefcase size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input name="fullName" onChange={(e) => setValue('fullName', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name *</label>
            <input name="store_details.store_name" onChange={(e) => setValue('store_details.store_name', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.store_details?.store_name && <p className="text-red-500 text-xs">{errors.store_details.store_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Description</label>
            <textarea name="store_details.store_description" onChange={(e) => setValue('store_details.store_description', e.target.value)} rows={3} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Type *</label>
            <select name="store_details.store_type" onChange={(e) => setValue('store_details.store_type', e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]">
              <option value="Individual / Sole Proprietor">Individual / Sole Proprietor</option>
              <option value="Private Limited">Private Limited</option>
              <option value="Partnership">Partnership</option>
            </select>
            {errors.store_details?.store_type && <p className="text-red-500 text-xs">{errors.store_details.store_type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input name="store_details.website" onChange={(e) => setValue('store_details.website', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.store_details?.website && <p className="text-red-500 text-xs">{errors.store_details.website.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Social Links</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <FiLink className="mr-2 text-gray-500" />
                <input name="store_details.social_links.facebook" onChange={(e) => setValue('store_details.social_links.facebook', e.target.value)} placeholder="Facebook URL" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              </div>
              <div className="flex items-center">
                <FiLink className="mr-2 text-gray-500" />
                <input name="store_details.social_links.twitter" onChange={(e) => setValue('store_details.social_links.twitter', e.target.value)} placeholder="Twitter URL" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              </div>
              <div className="flex items-center">
                <FiLink className="mr-2 text-gray-500" />
                <input name="store_details.social_links.instagram" onChange={(e) => setValue('store_details.social_links.instagram', e.target.value)} placeholder="Instagram URL" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              </div>
              <div className="flex items-center">
                <FiLink className="mr-2 text-gray-500" />
                <input name="store_details.social_links.linkedin" onChange={(e) => setValue('store_details.social_links.linkedin', e.target.value)} placeholder="LinkedIn URL" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              </div>
              <div className="flex items-center">
                <FiLink className="mr-2 text-gray-500" />
                <input name="store_details.social_links.youtube" onChange={(e) => setValue('store_details.social_links.youtube', e.target.value)} placeholder="YouTube URL" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo Upload</label>
            <input type="file" ref={logoRef} onChange={(e) => handleFileChange('store_details.logo', e)} className="hidden" />
            <button type="button" onClick={() => logoRef.current.click()} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mt-1">Upload</button>
            {getValues('store_details.logo') && <span className="ml-2 text-green-600">{getValues('store_details.logo').name}</span>}
          </div>
        </div>
      ),
    },
    {
      title: "Contact and Address",
      icon: <FiMapPin size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
            <div className="flex items-center space-x-2">
              <select value={countryCode} onChange={(e) => { setValue('countryCode', e.target.value); setCountryCode(e.target.value); }} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]">
                {countryCodes.map(({ code, country }) => (
                  <option key={code} value={code}>{`${country} (${code})`}</option>
                ))}
              </select>
              <input name="mobile" onChange={(e) => setValue('mobile', e.target.value)} type="text" placeholder="Enter mobile number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              {!otpSent && !mobileVerified && (
                <button type="button" onClick={sendOtp} className="px-4 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90">Send OTP</button>
              )}
            </div>
            {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile.message}</p>}
          </div>
          {otpSent && !mobileVerified && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
                />
                <button type="button" onClick={verifyOtp} className="px-4 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90">Verify OTP</button>
              </div>
            </div>
          )}
          {mobileVerified && <p className="text-green-600 text-xs">Mobile verified!</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Address *</label>
            <textarea name="store_details.store_address" onChange={(e) => setValue('store_details.store_address', e.target.value)} rows={3} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.store_details?.store_address && <p className="text-red-500 text-xs">{errors.store_details.store_address.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pincode *</label>
            <input name="store_details.pincode" onChange={(e) => setValue('store_details.pincode', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.store_details?.pincode && <p className="text-red-500 text-xs">{errors.store_details.pincode.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Contact</label>
            <div className="space-y-2">
              <input name="contacts.primary_contact.name" onChange={(e) => setValue('contacts.primary_contact.name', e.target.value)} placeholder="Name" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.primary_contact.designation" onChange={(e) => setValue('contacts.primary_contact.designation', e.target.value)} placeholder="Designation" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.primary_contact.email" onChange={(e) => setValue('contacts.primary_contact.email', e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.primary_contact.mobile" onChange={(e) => setValue('contacts.primary_contact.mobile', e.target.value)} placeholder="Mobile" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.primary_contact.whatsapp" onChange={(e) => setValue('contacts.primary_contact.whatsapp', e.target.value)} placeholder="WhatsApp" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Support Contact</label>
            <div className="space-y-2">
              <input name="contacts.support_contact.name" onChange={(e) => setValue('contacts.support_contact.name', e.target.value)} placeholder="Name" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.support_contact.designation" onChange={(e) => setValue('contacts.support_contact.designation', e.target.value)} placeholder="Designation" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.support_contact.email" onChange={(e) => setValue('contacts.support_contact.email', e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.support_contact.mobile" onChange={(e) => setValue('contacts.support_contact.mobile', e.target.value)} placeholder="Mobile" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
              <input name="contacts.support_contact.whatsapp" onChange={(e) => setValue('contacts.support_contact.whatsapp', e.target.value)} placeholder="WhatsApp" type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tax and Registration",
      icon: <FiFileText size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">PAN Number *</label>
            <input name="registration.pan_number" onChange={(e) => setValue('registration.pan_number', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.registration?.pan_number && <p className="text-red-500 text-xs">{errors.registration.pan_number.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GSTIN</label>
            <input name="registration.gstin" onChange={(e) => setValue('registration.gstin', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business License Number</label>
            <input name="registration.business_license_number" onChange={(e) => setValue('registration.business_license_number', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shop Act License Upload</label>
            <input type="file" ref={shopActRef} onChange={(e) => handleFileChange('registration.shop_act_license', e)} className="hidden" />
            <button type="button" onClick={() => shopActRef.current.click()} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mt-1">Upload</button>
            {getValues('registration.shop_act_license') && <span className="ml-2 text-green-600">{getValues('registration.shop_act_license').name}</span>}
          </div>
        </div>
      ),
    },
    {
      title: "Bank Details",
      icon: <FiDollarSign size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Account Number *</label>
            <input name="bank_details.bank_account_number" onChange={(e) => setValue('bank_details.bank_account_number', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.bank_details?.bank_account_number && <p className="text-red-500 text-xs">{errors.bank_details.bank_account_number.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IFSC Code *</label>
            <input name="bank_details.ifsc_code" onChange={(e) => setValue('bank_details.ifsc_code', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.bank_details?.ifsc_code && <p className="text-red-500 text-xs">{errors.bank_details.ifsc_code.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Holder Name *</label>
            <input name="bank_details.account_holder_name" onChange={(e) => setValue('bank_details.account_holder_name', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
            {errors.bank_details?.account_holder_name && <p className="text-red-500 text-xs">{errors.bank_details.account_holder_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UPI ID</label>
            <input name="bank_details.upi_id" onChange={(e) => setValue('bank_details.upi_id', e.target.value)} type="text" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Currency</label>
            <select name="bank_details.preferred_currency" onChange={(e) => setValue('bank_details.preferred_currency', e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]">
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Upload Documents",
      icon: <FiUpload size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Identity Proof *</label>
            <input type="file" ref={identityProofRef} onChange={(e) => handleFileChange('documents.identity_proof', e)} className="hidden" />
            <button type="button" onClick={() => identityProofRef.current.click()} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mt-1">Upload</button>
            {getValues('documents.identity_proof') && <span className="ml-2 text-green-600">{getValues('documents.identity_proof').name}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address Proof *</label>
            <input type="file" ref={addressProofRef} onChange={(e) => handleFileChange('documents.address_proof', e)} className="hidden" />
            <button type="button" onClick={() => addressProofRef.current.click()} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mt-1">Upload</button>
            {getValues('documents.address_proof') && <span className="ml-2 text-green-600">{getValues('documents.address_proof').name}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GST Certificate</label>
            <input type="file" ref={gstCertificateRef} onChange={(e) => handleFileChange('documents.gst_certificate', e)} className="hidden" />
            <button type="button" onClick={() => gstCertificateRef.current.click()} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mt-1">Upload</button>
            {getValues('documents.gst_certificate') && <span className="ml-2 text-green-600">{getValues('documents.gst_certificate').name}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Documents</label>
            <input type="file" multiple onChange={(e) => {
              const files = Array.from(e.target.files);
              setValue('documents.additional', files, { shouldValidate: true });
            }} className="hidden" id="additional" />
            <button type="button" onClick={() => document.getElementById('additional').click()} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mt-1">Upload</button>
            {getValues('documents.additional')?.length > 0 && getValues('documents.additional').map((file, idx) => (
              <span key={idx} className="ml-2 text-green-600 block">{file.name}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Product Categories",
      icon: <FiHash size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Add Category</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
              <button
                type="button"
                onClick={editingCategoryIndex !== null ? () => updateCategory(editingCategoryIndex) : addCategory}
                className="px-4 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90"
              >
                {editingCategoryIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            {errors.categories && <p className="text-red-500 text-xs">{errors.categories.message}</p>}
          </div>
          {getValues('categories')?.map((category, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{category.name}</span>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => { setEditingCategoryIndex(index); setNewCategory(category.name); }}><FiEdit2 className="text-gray-600" /></button>
                  <button type="button" onClick={() => removeCategory(index)}><FiX className="text-red-600" /></button>
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Subcategories</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Enter subcategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
                  />
                  <button
                    type="button"
                    onClick={editingSubcategoryIndex !== null ? () => updateSubcategory(index, editingSubcategoryIndex) : () => addSubcategory(index)}
                    className="px-4 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90"
                  >
                    {editingSubcategoryIndex !== null ? 'Update' : 'Add'}
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {category.subcategories.map((sub, subIndex) => (
                    <div key={subIndex} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                      {editingSubcategoryIndex === subIndex ? (
                        <>
                          <input
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                            className="bg-transparent border-b border-gray-300"
                          />
                          <button type="button" onClick={() => updateSubcategory(index, subIndex)}><FiCheck className="ml-2 text-green-600" /></button>
                        </>
                      ) : (
                        <>
                          {sub}
                          <button type="button" onClick={() => { setEditingSubcategoryIndex(subIndex); setNewSubcategory(sub); }}><FiEdit2 className="ml-2 text-gray-600" /></button>
                          <button type="button" onClick={() => removeSubcategory(index, subIndex)}><FiX className="ml-2 text-red-600" /></button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Operations",
      icon: <FiTruck size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Modes</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newDeliveryMode}
                onChange={(e) => setNewDeliveryMode(e.target.value)}
                placeholder="Add delivery mode (e.g., Standard, Express)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
              <button
                type="button"
                onClick={editingDeliveryIndex !== null ? () => updateDeliveryMode(editingDeliveryIndex) : addDeliveryMode}
                className="px-4 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90"
              >
                {editingDeliveryIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {getValues('operations.delivery_modes')?.map((mode, index) => (
                <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                  {editingDeliveryIndex === index ? (
                    <>
                      <input
                        value={newDeliveryMode}
                        onChange={(e) => setNewDeliveryMode(e.target.value)}
                        className="bg-transparent border-b border-gray-300"
                      />
                      <button type="button" onClick={() => updateDeliveryMode(index)}><FiCheck className="ml-2 text-green-600" /></button>
                    </>
                  ) : (
                    <>
                      {mode}
                      <button type="button" onClick={() => { setEditingDeliveryIndex(index); setNewDeliveryMode(mode); }}><FiEdit2 className="ml-2 text-gray-600" /></button>
                      <button type="button" onClick={() => removeDeliveryMode(index)}><FiX className="ml-2 text-red-600" /></button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Return Policy</label>
            <textarea name="operations.return_policy" onChange={(e) => setValue('operations.return_policy', e.target.value)} rows={4} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" placeholder="Describe your return policy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Average Delivery Time (days)</label>
            <input name="operations.avg_delivery_time_days" onChange={(e) => setValue('operations.avg_delivery_time_days', e.target.value)} type="number" min="0" className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]" />
          </div>
        </div>
      ),
    },
    {
      title: "Seller Agreement",
      icon: <FiFileText size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
            <p>By checking this box, you agree to the <a href="/terms" className="text-[#D26C44] underline">Terms and Conditions</a> and <a href="/privacy" className="text-[#D26C44] underline">Privacy Policy</a>.</p>
          </div>
          <div className="flex items-center">
            <input name="agreedToTerms" type="checkbox" checked={getValues('agreedToTerms')} onChange={(e) => setValue('agreedToTerms', e.target.checked)} className="h-5 w-5 text-[#D26C44] rounded focus:ring-[#D26C44]" />
            <label className="ml-2 text-sm font-medium text-gray-700">I agree to the terms and conditions *</label>
          </div>
          {errors.agreedToTerms && <p className="text-red-500 text-xs">{errors.agreedToTerms.message}</p>}
        </div>
      ),
    },
    {
      title: "Verification",
      icon: <FiLock size={24} style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-100 p-4 rounded-lg text-blue-800 text-sm flex items-center">
            <FiInfo className="mr-2" /> Ensure all details are correct before submitting. You’ll be notified once your account is verified.
          </div>
          {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}
          <button
            type="submit"
            disabled={mutation.isLoading}
            className={`w-full px-4 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90 transition ${mutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {mutation.isLoading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Vendor B2C</h1>
          <p className="mt-2 text-sm text-gray-600">Complete the steps below to register as a vendor on Sawtar LuxeInteriors.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-8">
          {steps.map((s, index) => (
            <div key={index} className={`flex-1 text-center p-4 rounded-lg ${step === index + 1 ? 'bg-[#D26C44] text-white' : 'bg-gray-200 text-gray-700'}`}>
              <div className="flex items-center justify-center mb-2">{s.icon}</div>
              <span className="text-sm font-medium">{s.title}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6 rounded-xl shadow-md">
              {steps[step - 1].content}
            </motion.div>
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  <FiArrowLeft className="mr-2" /> Previous
                </button>
              )}
              {step < 10 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90 transition ml-auto"
                >
                  Next <FiArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={mutation.isLoading}
                  className={`flex items-center px-6 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90 transition ml-auto ${mutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Complete <FiCheck className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerPage;