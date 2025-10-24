import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { MultiSelect } from 'react-multi-select-component';
import { FiPlus, FiX, FiUploadCloud } from 'react-icons/fi';
import { Button, ColorPicker, Input, Select, Checkbox, DatePicker } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { showSuccessAlert, showErrorAlert } from '../../../../manageApi/utils/sweetAlert';

const { Option } = Select;

const AddProducts = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  console.log('User ID:', user?.id, 'User Role:', user?.role);

  const [formData, setFormData] = useState({
    vendor: user?.id || '',
    category: '',
    brand: '',
    material: '',
    attributes: [],
    tags: [],
    name: '',
    description: '',
    short_description: '',
    product_code: '',
    care_maintenance: '',
    warranty: '',
    returns: '',
    quality_promise: '',
    pricing: {
      cost_price: 0,
      mrp: 0,
      sale_price: 0,
      currency: 'INR',
      discount: null,
      tax: {
        rate: 0,
        type: 'GST',
        inclusive: true,
      },
      margin: 0,
    },
    shipping: {
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
      },
      free_shipping: false,
    },
    seo: {
      meta_title: '',
      meta_description: '',
      keywords: [],
    },
    status: 'draft',
    verification_status: {
      status: 'pending',
      verified_by: null,
      verified_at: null,
      rejection_reason: '',
      suggestion: '',
    },
    documents: {
      product_invoice: null,
      product_certificate: null,
      quality_report: null,
    },
    color_variants: [{ color_name: '', color_code: '', images: [], image_alts: ['', '', '', '', ''] }],
    three_d_model: null,
  });

  const [hasDiscount, setHasDiscount] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [errors, setErrors] = useState({});
  const [colorVariants, setColorVariants] = useState([
    { color_name: '', color_code: '', images: [], image_alts: ['', '', '', '', ''] },
  ]);

  // Reference data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attributesList, setAttributesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  // Fetch reference data
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchMaterials();
    fetchAttributes();
    fetchTags();
  }, []);

  // Compute margin
  useEffect(() => {
    const { cost_price, sale_price } = formData.pricing;
    if (cost_price && sale_price) {
      setFormData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          margin: sale_price - cost_price,
        },
      }));
    }
  }, [formData.pricing.cost_price, formData.pricing.sale_price]);

  const fetchCategories = async () => {
    try {
      const res = await apiService.get('/categories');
      setCategories(res.categories || []);
    } catch (err) {
      showToast('Failed to fetch categories', 'error');
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await apiService.get('/brands');
      setBrands(res.brands || []);
    } catch (err) {
      showToast('Failed to fetch brands', 'error');
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await apiService.get('/materials');
      setMaterials(res.materials || []);
    } catch (err) {
      showToast('Failed to fetch materials', 'error');
    }
  };

  const fetchAttributes = async () => {
    try {
      const res = await apiService.get('/attributes');
      setAttributesList(res.attributes || []);
    } catch (err) {
      showToast('Failed to fetch attributes', 'error');
    }
  };

  const fetchTags = async () => {
    try {
      const res = await apiService.get('/tags');
      setTagsList(res.tags || []);
    } catch (err) {
      showToast('Failed to fetch tags', 'error');
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePricingChange = (name, value) => {
    setFormData({
      ...formData,
      pricing: { ...formData.pricing, [name]: value },
    });
    setErrors({ ...errors, [`pricing.${name}`]: '' });
  };

  const handleDiscountChange = (name, value) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        discount: { ...formData.pricing.discount, [name]: value },
      },
    });
    setErrors({ ...errors, [`pricing.discount.${name}`]: '' });
  };

  const handleTaxChange = (name, value) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        tax: { ...formData.pricing.tax, [name]: value },
      },
    });
    setErrors({ ...errors, [`pricing.tax.${name}`]: '' });
  };

  const handleShippingChange = (name, value) => {
    setFormData({
      ...formData,
      shipping: { ...formData.shipping, [name]: value },
    });
    setErrors({ ...errors, [`shipping.${name}`]: '' });
  };

  const handleDimensionsChange = (name, value) => {
    setFormData({
      ...formData,
      shipping: {
        ...formData.shipping,
        dimensions: { ...formData.shipping.dimensions, [name]: value },
      },
    });
    setErrors({ ...errors, [`shipping.dimensions.${name}`]: '' });
  };

  const handleSeoChange = (name, value) => {
    setFormData({
      ...formData,
      seo: { ...formData.seo, [name]: value },
    });
    setErrors({ ...errors, [`seo.${name}`]: '' });
  };

  const toggleDiscount = () => {
    setHasDiscount(!hasDiscount);
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        discount: hasDiscount ? null : { percentage: 0, amount: 0, valid_till: '' },
      },
    });
    setErrors({ ...errors, discount: '', discount_percentage: '', discount_amount: '', discount_valid_till: '' });
  };

  const handleDiscountTypeChange = (type) => {
    setFormData({
      ...formData,
      discountType: type,
      pricing: {
        ...formData.pricing,
        discount: {
          ...formData.pricing.discount,
          percentage: type === 'percentage' ? formData.pricing.discount?.percentage || 0 : 0,
          amount: type === 'amount' ? formData.pricing.discount?.amount || 0 : 0,
        },
      },
    });
    setErrors({ ...errors, discount: '', discount_percentage: '', discount_amount: '' });
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo,
          keywords: [...formData.seo.keywords, keywordInput.trim()],
        },
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    const newKeywords = [...formData.seo.keywords];
    newKeywords.splice(index, 1);
    setFormData({
      ...formData,
      seo: { ...formData.seo, keywords: newKeywords },
    });
  };

  // Color Variant Handlers
  const addColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      { color_name: '', color_code: '', images: [], image_alts: ['', '', '', '', ''] },
    ]);
  };

  const updateColorVariant = (index, field, value) => {
    const updatedVariants = [...colorVariants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setColorVariants(updatedVariants);
    setFormData({ ...formData, color_variants: updatedVariants });
    setErrors({ ...errors, [`color_variants.${index}.${field}`]: '' });
  };

  const removeColorVariant = (index) => {
    const updatedVariants = colorVariants.filter((_, i) => i !== index);
    setColorVariants(updatedVariants);
    setFormData({ ...formData, color_variants: updatedVariants });
  };

  const onDropImages = (index) => useCallback((acceptedFiles) => {
    const maxFiles = 5 - colorVariants[index].images.length;
    if (acceptedFiles.length > maxFiles) {
      showToast(`You can upload only ${maxFiles} more images for this variant`, 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = acceptedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        showToast(`${file.name}: Invalid file type`, 'error');
        return false;
      }
      if (file.size > maxSize) {
        showToast(`${file.name}: File size exceeds 5MB`, 'error');
        return false;
      }
      return true;
    });

    const updatedVariants = [...colorVariants];
    updatedVariants[index].images = [...updatedVariants[index].images, ...validFiles];
    setColorVariants(updatedVariants);
    setFormData({ ...formData, color_variants: updatedVariants });
    setErrors({ ...errors, color_variants: '' });
  }, [colorVariants]);

  const removeImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...colorVariants];
    updatedVariants[variantIndex].images.splice(imageIndex, 1);
    updatedVariants[variantIndex].image_alts.splice(imageIndex, 1);
    setColorVariants(updatedVariants);
    setFormData({ ...formData, color_variants: updatedVariants });
    setErrors({ ...errors, color_variants: '' });
  };

  const updateImageAlt = (variantIndex, imageIndex, value) => {
    const updatedVariants = [...colorVariants];
    updatedVariants[variantIndex].image_alts[imageIndex] = value;
    setColorVariants(updatedVariants);
    setFormData({ ...formData, color_variants: updatedVariants });
  };

  const onDrop3DModel = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const allowedFormats = ['glb', 'gltf', 'obj', 'fbx'];
    const fileFormat = file.name.split('.').pop().toLowerCase();

    if (!allowedFormats.includes(fileFormat)) {
      showToast('Invalid 3D model format', 'error');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      showToast('3D model size exceeds 50MB', 'error');
      return;
    }

    setFormData({ ...formData, three_d_model: { file, format: fileFormat } });
    setErrors({ ...errors, three_d_model: '' });
  }, []);

  const { getRootProps: get3DRootProps, getInputProps: get3DInputProps } = useDropzone({
    onDrop: onDrop3DModel,
    noClick: false,
    noKeyboard: false,
    multiple: false,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'model/obj': ['.obj'],
      'model/fbx': ['.fbx'],
    },
  });

  const onDropDocument = (field) => useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid document type', 'error');
      return;
    }
    if (file.size > maxSize) {
      showToast('Document size exceeds 5MB', 'error');
      return;
    }

    setFormData({
      ...formData,
      documents: { ...formData.documents, [field]: file },
    });
    setErrors({ ...errors, documents: '' });
  }, []);

  const getDropzoneProps = (field) => {
    return useDropzone({
      onDrop: onDropDocument(field),
      multiple: false,
      accept: {
        'application/pdf': ['.pdf'],
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.vendor) newErrors.vendor = 'Vendor is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.material) newErrors.material = 'Material is required';
    if (formData.pricing.sale_price <= 0) newErrors['pricing.sale_price'] = 'Sale price must be greater than 0';
    if (colorVariants.length === 0 || colorVariants.every(v => !v.color_name)) {
      newErrors.color_variants = 'At least one color variant is required';
    }
    colorVariants.forEach((variant, index) => {
      if (variant.color_name && variant.images.length === 0) {
        newErrors[`color_variants.${index}.images`] = `Images are required for ${variant.color_name}`;
      }
    });
    if (Object.values(formData.documents).every((file) => !file)) {
      newErrors.documents = 'At least one document is required';
    }
    if (hasDiscount) {
      if (formData.discountType === 'percentage') {
        if (!formData.pricing.discount?.percentage) {
          newErrors['pricing.discount.percentage'] = 'Percentage is required';
        } else if (formData.pricing.discount.percentage > 100 || formData.pricing.discount.percentage < 0) {
          newErrors['pricing.discount.percentage'] = 'Percentage must be between 0 and 100';
        }
      } else if (formData.discountType === 'amount') {
        if (!formData.pricing.discount?.amount) {
          newErrors['pricing.discount.amount'] = 'Amount is required';
        } else if (formData.pricing.discount.amount < 0) {
          newErrors['pricing.discount.amount'] = 'Amount must be positive';
        }
      }
      if (!formData.pricing.discount?.valid_till) {
        newErrors['pricing.discount.valid_till'] = 'Valid till date is required';
      }
    }
    if (formData.seo.meta_title.length > 60) {
      newErrors['seo.meta_title'] = 'Meta title must not exceed 60 characters';
    }
    if (formData.seo.meta_description.length > 160) {
      newErrors['seo.meta_description'] = 'Meta description must not exceed 160 characters';
    }
    if (formData.short_description.length > 200) {
      newErrors.short_description = 'Short description must not exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form Data:', {
      ...formData,
      color_variants: colorVariants,
      documents: Object.fromEntries(
        Object.entries(formData.documents).map(([key, file]) => [key, file ? file.name : null])
      ),
    });

    if (!validateForm()) {
      showToast('Please fix the validation errors', 'error');
      return;
    }

    try {
      const payload = new FormData();
      // Append flat fields
      payload.append('vendor', formData.vendor);
      payload.append('category', formData.category);
      payload.append('brand', formData.brand);
      payload.append('material', formData.material);
      formData.attributes.forEach((attr) => payload.append('attributes[]', attr));
      formData.tags.forEach((tag) => payload.append('tags[]', tag));
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('short_description', formData.short_description);
      payload.append('product_code', formData.product_code);
      payload.append('care_maintenance', formData.care_maintenance);
      payload.append('warranty', formData.warranty);
      payload.append('returns', formData.returns);
      payload.append('quality_promise', formData.quality_promise);
      payload.append('status', formData.status);

      // Pricing
      payload.append('pricing.cost_price', formData.pricing.cost_price);
      payload.append('pricing.mrp', formData.pricing.mrp);
      payload.append('pricing.sale_price', formData.pricing.sale_price);
      payload.append('pricing.currency', formData.pricing.currency);
      if (hasDiscount) {
        payload.append('pricing.discount.valid_till', formData.pricing.discount.valid_till);
        if (formData.discountType === 'percentage') {
          payload.append('pricing.discount.percentage', formData.pricing.discount.percentage);
        } else if (formData.discountType === 'amount') {
          payload.append('pricing.discount.amount', formData.pricing.discount.amount);
        }
      }
      payload.append('pricing.tax.rate', formData.pricing.tax.rate);
      payload.append('pricing.tax.type', formData.pricing.tax.type);
      payload.append('pricing.tax.inclusive', formData.pricing.tax.inclusive);

      // Shipping
      payload.append('shipping.weight', formData.shipping.weight);
      payload.append('shipping.dimensions.length', formData.shipping.dimensions.length);
      payload.append('shipping.dimensions.width', formData.shipping.dimensions.width);
      payload.append('shipping.dimensions.height', formData.shipping.dimensions.height);
      payload.append('shipping.free_shipping', formData.shipping.free_shipping);

      // SEO
      payload.append('seo.meta_title', formData.seo.meta_title);
      payload.append('seo.meta_description', formData.seo.meta_description);
      formData.seo.keywords.forEach((kw) => payload.append('seo.keywords[]', kw));

      // Color Variants
      payload.append('color_variants', JSON.stringify(
        colorVariants.map((variant, index) => ({
          color_name: variant.color_name,
          color_code: variant.color_code,
          image_alts: variant.image_alts.filter((alt) => alt.trim()),
        }))
      ));
      colorVariants.forEach((variant, index) => {
        variant.images.forEach((file, i) => {
          if (!file.url) payload.append(`color_images_${index}`, file);
        });
      });

      // 3D Model
      if (formData.three_d_model?.file) {
        payload.append(`threeDModel_${formData.three_d_model.format}`, formData.three_d_model.file);
        if (formData.three_d_model.alt_text) {
          payload.append('three_d_alt', formData.three_d_model.alt_text);
        }
      }

      // Documents
      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file && !file.url) payload.append(key, file);
      });

      const response = await apiService.post('/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSuccessAlert('Success', 'Product added successfully');
      resetForm();
      navigate(-1);
    } catch (err) {
      if (err.response?.data?.errors) {
        const newErrors = {};
        err.response.data.errors.forEach((error) => {
          newErrors[error.field] = error.message;
          showToast(`Error in ${error.field}: ${error.message}`, 'error');
        });
        setErrors(newErrors);
      } else {
        showErrorAlert('Error', err.response?.data?.message || 'Failed to add product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vendor: user?.id || '',
      category: '',
      brand: '',
      material: '',
      attributes: [],
      tags: [],
      name: '',
      description: '',
      short_description: '',
      product_code: '',
      care_maintenance: '',
      warranty: '',
      returns: '',
      quality_promise: '',
      pricing: {
        cost_price: 0,
        mrp: 0,
        sale_price: 0,
        currency: 'INR',
        discount: null,
        tax: {
          rate: 0,
          type: 'GST',
          inclusive: true,
        },
        margin: 0,
      },
      shipping: {
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: '',
        },
        free_shipping: false,
      },
      seo: {
        meta_title: '',
        meta_description: '',
        keywords: [],
      },
      status: 'draft',
      verification_status: {
        status: 'pending',
        verified_by: null,
        verified_at: null,
        rejection_reason: '',
        suggestion: '',
      },
      documents: {
        product_invoice: null,
        product_certificate: null,
        quality_report: null,
      },
      color_variants: [{ color_name: '', color_code: '', images: [], image_alts: ['', '', '', '', ''] }],
      three_d_model: null,
    });
    setHasDiscount(false);
    setKeywordInput('');
    setColorVariants([{ color_name: '', color_code: '', images: [], image_alts: ['', '', '', '', ''] }]);
    setErrors({});
  };

  const renderError = (field) => {
    return errors[field] ? (
      <p className="text-red-500 text-xs italic mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Product</h1>

      {/* Navigation Links */}
      <div className="mb-6 flex gap-4">
        <Link to="/products" className="ant-btn ant-btn-primary">
          <FiPlus size={16} className="inline mr-2" /> View Products
        </Link>
        <Link to="/products/edit" className="ant-btn ant-btn-primary">
          <FiPlus size={16} className="inline mr-2" /> Edit Products
        </Link>
      </div>

      {/* Add Product Form */}
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Product Details */}
            <div className="space-y-6">
              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                <Input value={user?.full_name || 'Current Vendor'} disabled />
                {renderError('vendor')}
              </div>

              {/* Category Select */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <Select
                    value={formData.category}
                    onChange={(value) => handleChange('category', value)}
                    className="w-full"
                    status={errors.category ? 'error' : ''}
                  >
                    <Option value="">Select Category</Option>
                    {categories.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                  {renderError('category')}
                </div>
                <Link to="/sawtar/cms/seller/b2c/category/add" className="ant-btn ant-btn-success">
                  <FiPlus size={14} className="inline mr-1" /> Add New
                </Link>
              </div>

              {/* Brand Select */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <Select
                    value={formData.brand}
                    onChange={(value) => handleChange('brand', value)}
                    className="w-full"
                    status={errors.brand ? 'error' : ''}
                  >
                    <Option value="">Select Brand</Option>
                    {brands.map((brand) => (
                      <Option key={brand._id} value={brand._id}>
                        {brand.name}
                      </Option>
                    ))}
                  </Select>
                  {renderError('brand')}
                </div>
                <Link to="/sawtar/cms/seller/b2c/brands/add" className="ant-btn ant-btn-success">
                  <FiPlus size={14} className="inline mr-1" /> Add New
                </Link>
              </div>

              {/* Material Select */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
                  <Select
                    value={formData.material}
                    onChange={(value) => handleChange('material', value)}
                    className="w-full"
                    status={errors.material ? 'error' : ''}
                  >
                    <Option value="">Select Material</Option>
                    {materials.map((mat) => (
                      <Option key={mat._id} value={mat._id}>
                        {mat.name}
                      </Option>
                    ))}
                  </Select>
                  {renderError('material')}
                </div>
                <Link to="/sawtar/cms/seller/b2c/material/add" className="ant-btn ant-btn-success">
                  <FiPlus size={14} className="inline mr-1" /> Add New
                </Link>
              </div>

              {/* Attributes MultiSelect */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attributes</label>
                  <MultiSelect
                    options={attributesList.map((attr) => ({ label: attr.name, value: attr._id }))}
                    value={attributesList
                      .filter((attr) => formData.attributes.includes(attr._id))
                      .map((attr) => ({ label: attr.name, value: attr._id }))}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        attributes: selected.map((s) => s.value),
                      })
                    }
                    labelledBy="Select Attributes"
                    hasSelectAll={false}
                    className="border border-gray-300 rounded-md"
                  />
                </div>
                <Link to="/sawtar/cms/seller/b2c/attributes/add" className="ant-btn ant-btn-success">
                  <FiPlus size={14} className="inline mr-1" /> Add New
                </Link>
              </div>

              {/* Tags MultiSelect */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <MultiSelect
                    options={tagsList.map((tag) => ({ label: tag.name, value: tag._id }))}
                    value={tagsList
                      .filter((tag) => formData.tags.includes(tag._id))
                      .map((tag) => ({ label: tag.name, value: tag._id }))}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        tags: selected.map((s) => s.value),
                      })
                    }
                    labelledBy="Select Tags"
                    hasSelectAll={false}
                    className="border border-gray-300 rounded-md"
                  />
                </div>
                <Link to="/sawtar/cms/seller/b2c/tags/add" className="ant-btn ant-btn-success">
                  <FiPlus size={14} className="inline mr-1" /> Add New
                </Link>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  status={errors.name ? 'error' : ''}
                />
                {renderError('name')}
              </div>

              {/* Product Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                <Input
                  value={formData.product_code}
                  onChange={(e) => handleChange('product_code', e.target.value)}
                  status={errors.product_code ? 'error' : ''}
                />
                {renderError('product_code')}
              </div>

              {/* Description (React Quill) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <ReactQuill
                  value={formData.description}
                  onChange={(value) => handleChange('description', value)}
                  theme="snow"
                  className="h-40 mb-12"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <Input.TextArea
                  value={formData.short_description}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  rows={2}
                  status={errors.short_description ? 'error' : ''}
                />
                {renderError('short_description')}
              </div>

              {/* Care and Maintenance (React Quill) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Care & Maintenance</label>
                <ReactQuill
                  value={formData.care_maintenance}
                  onChange={(value) => handleChange('care_maintenance', value)}
                  theme="snow"
                  className="h-40 mb-12"
                />
              </div>

              {/* Warranty (React Quill) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                <ReactQuill
                  value={formData.warranty}
                  onChange={(value) => handleChange('warranty', value)}
                  theme="snow"
                  className="h-40 mb-12"
                />
              </div>

              {/* Returns (React Quill) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Returns</label>
                <ReactQuill
                  value={formData.returns}
                  onChange={(value) => handleChange('returns', value)}
                  theme="snow"
                  className="h-40 mb-12"
                />
              </div>

              {/* Quality Promise (React Quill) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Promise</label>
                <ReactQuill
                  value={formData.quality_promise}
                  onChange={(value) => handleChange('quality_promise', value)}
                  theme="snow"
                  className="h-40 mb-12"
                />
              </div>

              {/* Pricing Section */}
              <div className="space-y-4 border border-gray-200 p-4 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost Price</label>
                    <Input
                      type="number"
                      value={formData.pricing.cost_price}
                      onChange={(e) => handlePricingChange('cost_price', e.target.value)}
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">MRP</label>
                    <Input
                      type="number"
                      value={formData.pricing.mrp}
                      onChange={(e) => handlePricingChange('mrp', e.target.value)}
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sale Price *</label>
                    <Input
                      type="number"
                      value={formData.pricing.sale_price}
                      onChange={(e) => handlePricingChange('sale_price', e.target.value)}
                      status={errors['pricing.sale_price'] ? 'error' : ''}
                      min={0}
                      step="0.01"
                    />
                    {renderError('pricing.sale_price')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Currency</label>
                    <Select
                      value={formData.pricing.currency}
                      onChange={(value) => handlePricingChange('currency', value)}
                      className="w-full"
                    >
                      <Option value="INR">INR</Option>
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Margin (Auto-calculated)</label>
                    <Input value={formData.pricing.margin} disabled />
                  </div>
                </div>

                {/* Tax */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                    <Input
                      type="number"
                      value={formData.pricing.tax.rate}
                      onChange={(e) => handleTaxChange('rate', e.target.value)}
                      min={0}
                      max={100}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tax Type</label>
                    <Input
                      value={formData.pricing.tax.type}
                      onChange={(e) => handleTaxChange('type', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      checked={formData.pricing.tax.inclusive}
                      onChange={(e) => handleTaxChange('inclusive', e.target.checked)}
                    >
                      Tax Inclusive
                    </Checkbox>
                  </div>
                </div>

                {/* Discount */}
                <div className="flex items-center gap-2">
                  <Checkbox checked={hasDiscount} onChange={toggleDiscount}>
                    Add Discount
                  </Checkbox>
                </div>
                {hasDiscount && (
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      <Checkbox
                        checked={formData.discountType === 'percentage'}
                        onChange={() => handleDiscountTypeChange('percentage')}
                      >
                        Percentage
                      </Checkbox>
                      <Checkbox
                        checked={formData.discountType === 'amount'}
                        onChange={() => handleDiscountTypeChange('amount')}
                      >
                        Amount
                      </Checkbox>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.discountType === 'percentage' ? (
                        <div>
                          <label className="block text-sm font-medium mb-1">Percentage *</label>
                          <Input
                            type="number"
                            value={formData.pricing.discount?.percentage || ''}
                            onChange={(e) => handleDiscountChange('percentage', e.target.value)}
                            status={errors['pricing.discount.percentage'] ? 'error' : ''}
                            min={0}
                            max={100}
                            step="0.1"
                          />
                          {renderError('pricing.discount.percentage')}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium mb-1">Amount *</label>
                          <Input
                            type="number"
                            value={formData.pricing.discount?.amount || ''}
                            onChange={(e) => handleDiscountChange('amount', e.target.value)}
                            status={errors['pricing.discount.amount'] ? 'error' : ''}
                            min={0}
                            step="0.01"
                          />
                          {renderError('pricing.discount.amount')}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-1">Valid Till *</label>
                        <DatePicker
                          value={formData.pricing.discount?.valid_till ? new Date(formData.pricing.discount.valid_till) : null}
                          onChange={(date, dateString) => handleDiscountChange('valid_till', dateString)}
                          className="w-full"
                          status={errors['pricing.discount.valid_till'] ? 'error' : ''}
                        />
                        {renderError('pricing.discount.valid_till')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Section */}
              <div className="space-y-4 border border-gray-200 p-4 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold">Shipping</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight</label>
                  <Input
                    value={formData.shipping.weight}
                    onChange={(e) => handleShippingChange('weight', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Length</label>
                    <Input
                      value={formData.shipping.dimensions.length}
                      onChange={(e) => handleDimensionsChange('length', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width</label>
                    <Input
                      value={formData.shipping.dimensions.width}
                      onChange={(e) => handleDimensionsChange('width', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height</label>
                    <Input
                      value={formData.shipping.dimensions.height}
                      onChange={(e) => handleDimensionsChange('height', e.target.value)}
                    />
                  </div>
                </div>
                <Checkbox
                  checked={formData.shipping.free_shipping}
                  onChange={(e) => handleShippingChange('free_shipping', e.target.checked)}
                >
                  Free Shipping
                </Checkbox>
              </div>

              {/* SEO Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Meta Title</label>
                <Input
                  value={formData.seo.meta_title}
                  onChange={(e) => handleSeoChange('meta_title', e.target.value)}
                  status={errors['seo.meta_title'] ? 'error' : ''}
                />
                {renderError('seo.meta_title')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Meta Description</label>
                <Input.TextArea
                  value={formData.seo.meta_description}
                  onChange={(e) => handleSeoChange('meta_description', e.target.value)}
                  rows={3}
                  status={errors['seo.meta_description'] ? 'error' : ''}
                />
                {renderError('seo.meta_description')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
                <div className="flex items-end gap-3">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Enter keyword"
                  />
                  <Button type="primary" onClick={addKeyword}>
                    <FiPlus size={16} className="inline mr-2" /> Add
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.seo.keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="ml-2 text-indigo-600 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  className="w-full"
                >
                  <Option value="draft">Draft</Option>
                  <Option value="pending_verification">Pending Verification</Option>
                  <Option value="active">Active</Option>
                  <Option value="rejected">Rejected</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </div>

              {/* Verification Status (SuperAdmin only) */}
              {user?.role === 'SuperAdmin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                  <Select
                    value={formData.verification_status.status}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        verification_status: { ...formData.verification_status, status: value },
                      })
                    }
                    className="w-full"
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                  </Select>
                  {formData.verification_status.status === 'rejected' && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Rejection Reason</label>
                        <Input.TextArea
                          value={formData.verification_status.rejection_reason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              verification_status: {
                                ...formData.verification_status,
                                rejection_reason: e.target.value,
                              },
                            })
                          }
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Suggestion</label>
                        <Input.TextArea
                          value={formData.verification_status.suggestion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              verification_status: {
                                ...formData.verification_status,
                                suggestion: e.target.value,
                              },
                            })
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Uploads */}
            <div className="space-y-6">
              {/* Color Variants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Variants * (At least one)</label>
                {colorVariants.map((variant, index) => {
                  const { getRootProps, getInputProps } = useDropzone({
                    onDrop: onDropImages(index),
                    noClick: false,
                    noKeyboard: false,
                    accept: {
                      'image/jpeg': ['.jpeg', '.jpg'],
                      'image/png': ['.png'],
                      'image/gif': ['.gif'],
                    },
                  });
                  return (
                    <div key={index} className="border p-4 rounded-md mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Variant {index + 1}</h4>
                        <Button
                          type="text"
                          danger
                          onClick={() => removeColorVariant(index)}
                          disabled={colorVariants.length === 1}
                        >
                          <FiX size={16} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Color Name *</label>
                          <Input
                            value={variant.color_name}
                            onChange={(e) => updateColorVariant(index, 'color_name', e.target.value)}
                            status={errors[`color_variants.${index}.color_name`] ? 'error' : ''}
                          />
                          {renderError(`color_variants.${index}.color_name`)}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Color Code</label>
                          <ColorPicker
                            value={variant.color_code}
                            onChange={(color) => updateColorVariant(index, 'color_code', color.toHexString())}
                            showText
                          />
                        </div>
                      </div>
                      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-indigo-500">
                        <input {...getInputProps()} />
                        <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                        <p className="text-gray-600 mt-2">Drag 'n' drop images for {variant.color_name || `Variant ${index + 1}`}</p>
                        <p className="text-xs text-gray-500">JPEG, PNG, JPG, GIF (max 5MB each)</p>
                      </div>
                      {renderError(`color_variants.${index}.images`)}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {variant.images.map((file, i) => (
                          <div key={i} className="relative border border-gray-200 rounded-md p-2 bg-white shadow-sm">
                            <img
                              src={file.url || URL.createObjectURL(file)}
                              alt=""
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <Button
                              type="text"
                              danger
                              className="absolute top-1 right-1"
                              onClick={() => removeImage(index, i)}
                            >
                              <FiX size={12} />
                            </Button>
                            <Input
                              className="mt-2 text-xs"
                              placeholder={`Alt text ${i + 1}`}
                              value={variant.image_alts[i] || ''}
                              onChange={(e) => updateImageAlt(index, i, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <Button type="primary" onClick={addColorVariant}>
                  <FiPlus size={16} className="inline mr-2" /> Add Color Variant
                </Button>
                {renderError('color_variants')}
              </div>

              {/* 3D Model Dropzone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">3D Model (Optional)</label>
                <div
                  {...get3DRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-indigo-500"
                >
                  <input {...get3DInputProps()} />
                  <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                  <p className="text-gray-600 mt-2">Drag 'n' drop 3D model here, or click to select</p>
                  <p className="text-xs text-gray-500">GLB, GLTF, OBJ, FBX (max 50MB)</p>
                </div>
                {formData.three_d_model?.file && (
                  <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span className="text-sm truncate">{formData.three_d_model.file.name}</span>
                    <Button
                      type="text"
                      danger
                      onClick={() => setFormData({ ...formData, three_d_model: null })}
                    >
                      <FiX size={16} />
                    </Button>
                  </div>
                )}
                {formData.three_d_model?.file && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">3D Model Alt Text</label>
                    <Input
                      value={formData.three_d_model?.alt_text || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          three_d_model: { ...formData.three_d_model, alt_text: e.target.value },
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Documents Dropzones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Documents * (At least one)</label>
                <div className="grid grid-cols-3 gap-4">
                  {['product_invoice', 'product_certificate', 'quality_report'].map((field) => {
                    const { getRootProps, getInputProps } = getDropzoneProps(field);
                    return (
                      <div key={field}>
                        <p className="text-sm font-medium mb-1 capitalize">{field.replace('_', ' ')}</p>
                        <div
                          {...getRootProps()}
                          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500"
                        >
                          <input {...getInputProps()} />
                          <FiUploadCloud className="mx-auto text-2xl text-gray-400" />
                          <p className="text-xs text-gray-600 mt-2 truncate">
                            {formData.documents[field] ? formData.documents[field].name : 'No file chosen'}
                          </p>
                          <p className="text-xs text-gray-600">Drop file or click</p>
                        </div>
                        {formData.documents[field] && (
                          <div className="mt-2 flex items-center justify-between bg-gray-100 p-1 rounded-md">
                            <span className="text-xs truncate">{formData.documents[field].name}</span>
                            <Button
                              type="text"
                              danger
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  documents: { ...formData.documents, [field]: null },
                                })
                              }
                            >
                              <FiX size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {renderError('documents')}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button type="primary" htmlType="submit" size="large">
              <FiPlus size={20} className="inline mr-2" /> Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;