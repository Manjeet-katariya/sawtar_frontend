import React, { useState, useEffect, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiPlus, FiX, FiUploadCloud } from 'react-icons/fi';
import { Button, Card, ColorPicker, Input, Select, Checkbox } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showSuccessAlert, showErrorAlert } from '../../../../manageApi/utils/sweetAlert';

const { Option } = Select;

const ColorVariantItem = memo(({ 
  variant, 
  index, 
  colorNameError, 
  imagesError, 
  removable, 
  onUpdateField, 
  onRemoveVariant, 
  onRemoveImage, 
  onUpdateAlt, 
  onDrop 
}) => {
  const localOnDrop = useCallback(
    (acceptedFiles) => {
      onDrop(index, acceptedFiles);
    },
    [index, onDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: localOnDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    multiple: true,
  });

  return (
    <div className="border p-4 rounded-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Variant {index + 1}</h4>
        <Button type="text" danger onClick={onRemoveVariant} disabled={!removable}>
          <FiX size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-sm font-medium mb-1">Color Name *</label>
          <Input
            size="large"
            value={variant.color_name}
            onChange={(e) => onUpdateField('color_name', e.target.value)}
            status={colorNameError ? 'error' : ''}
          />
          {colorNameError && <p className="text-red-500 text-xs italic mt-1">{colorNameError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color Code</label>
          <ColorPicker
            value={variant.color_code}
            onChange={(color) => onUpdateField('color_code', color.toHexString())}
            showText
          />
        </div>
      </div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-indigo-500"
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
        <p className="text-gray-600 mt-2">
          Drag 'n' drop images for {variant.color_name || `Variant ${index + 1}`}
        </p>
        <p className="text-xs text-gray-500">JPEG, PNG, JPG, GIF (max 5MB each, up to 5 total)</p>
      </div>
      {imagesError && <p className="text-red-500 text-xs italic mt-1">{imagesError}</p>}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {variant.images.map((file, i) => (
          <div key={i} className="relative border border-gray-200 rounded-md p-2 bg-white shadow-sm">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${i + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
            <Button
              type="text"
              danger
              className="absolute top-1 right-1"
              onClick={() => onRemoveImage(i)}
            >
              <FiX size={12} />
            </Button>
            <Input
              className="mt-2 text-xs"
              placeholder={`Alt text ${i + 1}`}
              value={variant.image_alts[i] || ''}
              onChange={(e) => onUpdateAlt(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

const AddProducts = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

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
    care_maintenance: '',
    warranty: '',
    returns: '',
    quality_promise: '',
    pricing: {
      cost_price: 0,
      mrp: 0,
      base_price: 0,
      currency: '',
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
    color_variants: [{ color_name: '', color_code: '', images: [], image_alts: [] }],
    three_d_model: null,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState({ id: '', name: '' });
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attributesList, setAttributesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  // Fetch reference data
  useEffect(() => {
    fetchCategories();
    fetchCurrency();
    fetchBrands();
    fetchMaterials();
    fetchAttributes();
    fetchTags();
  }, []);

  // Auto-compute margin whenever cost_price or base_price changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        margin: Math.max((prev.pricing.base_price || 0) - (prev.pricing.cost_price || 0), 0),
      },
    }));
  }, [formData.pricing.cost_price, formData.pricing.base_price]);

  const fetchCategories = async () => {
    try {
      const res = await apiService.get('/categories');
      setCategories(res.categories || []);
    } catch (err) {
      // Handle error silently or log
    }
  };

  const fetchCurrency = async () => {
    try {
      const res = await apiService.get('/setting/currency?isDefault=true');
      setCurrency({ id: res.currency._id, name: res.currency.name });
      setFormData((prev) => ({
        ...prev,
        pricing: { ...prev.pricing, currency: res.currency._id },
      }));
    } catch (err) {
      // Handle error silently or log
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await apiService.get('/brands');
      setBrands(res.brands || []);
    } catch (err) {
      // Handle error silently or log
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await apiService.get('/materials');
      setMaterials(res.materials || []);
    } catch (err) {
      // Handle error silently or log
    }
  };

  const fetchAttributes = async () => {
    try {
      const res = await apiService.get('/attributes');
      setAttributesList(res.attributes || []);
    } catch (err) {
      // Handle error silently or log
    }
  };

  const fetchTags = async () => {
    try {
      const res = await apiService.get('/tags');
      setTagsList(res.tags || []);
    } catch (err) {
      // Handle error silently or log
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

  // Color Variant Handlers (state fully managed in formData.color_variants)
  const addColorVariant = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      color_variants: [
        ...prev.color_variants,
        { color_name: '', color_code: '', images: [], image_alts: [] },
      ],
    }));
  }, []);

  const handleUpdateVariantField = useCallback((index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.color_variants];
      newVariants[index][field] = value;
      return { ...prev, color_variants: newVariants };
    });
  }, []);

  const handleRemoveVariant = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      color_variants: prev.color_variants.filter((_, i) => i !== index),
    }));
  }, []);

  const handleRemoveImage = useCallback((variantIndex, imageIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.color_variants];
      newVariants[variantIndex].images.splice(imageIndex, 1);
      newVariants[variantIndex].image_alts.splice(imageIndex, 1);
      return { ...prev, color_variants: newVariants };
    });
  }, []);

  const handleUpdateImageAlt = useCallback((variantIndex, imageIndex, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.color_variants];
      newVariants[variantIndex].image_alts[imageIndex] = value;
      return { ...prev, color_variants: newVariants };
    });
  }, []);

  const handleVariantImageDrop = useCallback((index, acceptedFiles) => {
    setFormData((prev) => {
      const variant = prev.color_variants[index];
      const currentLength = variant.images.length;
      const maxAdditional = 5 - currentLength;
      if (acceptedFiles.length > maxAdditional) {
        return prev;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const maxSize = 5 * 1024 * 1024;
      const validFiles = acceptedFiles.filter((file) => allowedTypes.includes(file.type) && file.size <= maxSize);
      if (validFiles.length === 0) return prev;
      const newVariants = [...prev.color_variants];
      newVariants[index] = {
        ...newVariants[index],
        images: [...newVariants[index].images, ...validFiles],
        image_alts: [...newVariants[index].image_alts, ...Array(validFiles.length).fill('')],
      };
      return { ...prev, color_variants: newVariants };
    });
  }, []);

  const onDrop3DModel = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const allowedFormats = ['glb', 'gltf', 'obj', 'fbx'];
    const fileFormat = file.name.split('.').pop().toLowerCase();
    if (!allowedFormats.includes(fileFormat)) return;
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) return;
    setFormData((prev) => ({ ...prev, three_d_model: { file, format: fileFormat, alt_text: '' } }));
  }, []);

  const { getRootProps: get3DRootProps, getInputProps: get3DInputProps } = useDropzone({
    onDrop: onDrop3DModel,
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
    const maxSize = 5 * 1024 * 1024;
    if (allowedTypes.includes(file.type) && file.size <= maxSize) {
      setFormData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [field]: file },
      }));
    }
  }, []);

  const getDocumentDropzoneProps = (field) => useDropzone({
    onDrop: onDropDocument(field),
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append('vendor', formData.vendor);
      payload.append('category', formData.category);
      payload.append('brand', formData.brand);
      payload.append('material', formData.material);
      formData.attributes.forEach((attr) => payload.append('attributes[]', attr));
      formData.tags.forEach((tag) => payload.append('tags[]', tag));
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('short_description', formData.short_description);
      payload.append('care_maintenance', formData.care_maintenance);
      payload.append('warranty', formData.warranty);
      payload.append('returns', formData.returns);
      payload.append('quality_promise', formData.quality_promise);
      payload.append('status', formData.status);
      // Pricing
      payload.append('pricing.cost_price', formData.pricing.cost_price);
      payload.append('pricing.base_price', formData.pricing.base_price);
      payload.append('pricing.mrp', formData.pricing.mrp);
      payload.append('pricing.currency', formData.pricing.currency);
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
      payload.append(
        'color_variants',
        JSON.stringify(
          formData.color_variants.map((variant) => ({
            color_name: variant.color_name,
            color_code: variant.color_code,
            image_alts: variant.image_alts,
          }))
        )
      );
      formData.color_variants.forEach((variant, index) => {
        variant.images.forEach((file) => {
          payload.append(`color_images_${index}`, file);
        });
      });
      // 3D Model
      if (formData.three_d_model?.file) {
        payload.append(`threeDModel_${formData.three_d_model.format}`, formData.three_d_model.file);
        payload.append('three_d_alt', formData.three_d_model.alt_text || '');
      }
      // Documents
      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file) payload.append(key, file);
      });

      await apiService.post('/products', payload, {
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
      care_maintenance: '',
      warranty: '',
      returns: '',
      quality_promise: '',
      pricing: {
        cost_price: 0,
        mrp: 0,
        base_price: 0,
        currency: currency.id,
        margin: 0,
      },
      shipping: {
        weight: '',
        dimensions: { length: '', width: '', height: '' },
        free_shipping: false,
      },
      seo: { meta_title: '', meta_description: '', keywords: [] },
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
      color_variants: [{ color_name: '', color_code: '', images: [], image_alts: [] }],
      three_d_model: null,
    });
    setKeywordInput('');
    setErrors({});
  };

  const renderError = (field) => {
    return errors[field] ? <p className="text-red-500 text-xs italic mt-1">{errors[field]}</p> : null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Product</h1>
      <form onSubmit={handleSubmit}>
        {/* General Information Section */}
        <Card title="General Information" className="mb-6">
          <div className="space-y-6">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <Select
                  size="large"
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
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <Select
                  size="large"
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
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
                <Select
                  size="large"
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
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attributes</label>
                <Select
                  mode="multiple"
                  size="large"
                  value={formData.attributes}
                  onChange={(value) => handleChange('attributes', value)}
                  className="w-full"
                  placeholder="Select Attributes"
                >
                  {attributesList.map((attr) => (
                    <Option key={attr._id} value={attr._id}>
                      {attr.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Link to="/sawtar/cms/seller/b2c/attributes/add" className="ant-btn ant-btn-success">
                <FiPlus size={14} className="inline mr-1" /> Add New
              </Link>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <Select
                  mode="multiple"
                  size="large"
                  value={formData.tags}
                  onChange={(value) => handleChange('tags', value)}
                  className="w-full"
                  placeholder="Select Tags"
                >
                  {tagsList.map((tag) => (
                    <Option key={tag._id} value={tag._id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Link to="/sawtar/cms/seller/b2c/tags/add" className="ant-btn ant-btn-success">
                <FiPlus size={14} className="inline mr-1" /> Add New
              </Link>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <Input
                size="large"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                status={errors.name ? 'error' : ''}
              />
              {renderError('name')}
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <ReactQuill
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                theme="snow"
                className="h-40 mb-12"
              />
              {renderError('description')}
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Care & Maintenance</label>
              <ReactQuill
                value={formData.care_maintenance}
                onChange={(value) => handleChange('care_maintenance', value)}
                theme="snow"
                className="h-40 mb-12"
              />
              {renderError('care_maintenance')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
              <ReactQuill
                value={formData.warranty}
                onChange={(value) => handleChange('warranty', value)}
                theme="snow"
                className="h-40 mb-12"
              />
              {renderError('warranty')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Returns</label>
              <ReactQuill
                value={formData.returns}
                onChange={(value) => handleChange('returns', value)}
                theme="snow"
                className="h-40 mb-12"
              />
              {renderError('returns')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Promise</label>
              <ReactQuill
                value={formData.quality_promise}
                onChange={(value) => handleChange('quality_promise', value)}
                theme="snow"
                className="h-40 mb-12"
              />
              {renderError('quality_promise')}
            </div>
          </div>
        </Card>

        {/* Pricing Section */}
        <Card title="Pricing" className="mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cost Price</label>
              <Input
                size="large"
                type="number"
                value={formData.pricing.cost_price}
                onChange={(e) => handlePricingChange('cost_price', e.target.value)}
                min={0}
                step="0.01"
                status={errors['pricing.cost_price'] ? 'error' : ''}
              />
              {renderError('pricing.cost_price')}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MRP *</label>
              <Input
                size="large"
                type="number"
                value={formData.pricing.mrp}
                onChange={(e) => handlePricingChange('mrp', e.target.value)}
                min={0}
                step="0.01"
                status={errors['pricing.mrp'] ? 'error' : ''}
              />
              {renderError('pricing.mrp')}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base Price</label>
              <Input
                size="large"
                type="number"
                value={formData.pricing.base_price}
                onChange={(e) => handlePricingChange('base_price', e.target.value)}
                min={0}
                step="0.01"
                status={errors['pricing.base_price'] ? 'error' : ''}
              />
              {renderError('pricing.base_price')}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Currency</label>
            <Input size="large" value={currency.name} disabled />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Margin (Auto-calculated)</label>
            <Input size="large" value={formData.pricing.margin} disabled />
          </div>
        </Card>

        {/* Shipping Section */}
        <Card title="Shipping" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Weight</label>
              <Input
                size="large"
                value={formData.shipping.weight}
                onChange={(e) => handleShippingChange('weight', e.target.value)}
                status={errors['shipping.weight'] ? 'error' : ''}
              />
              {renderError('shipping.weight')}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Length</label>
                <Input
                  size="large"
                  value={formData.shipping.dimensions.length}
                  onChange={(e) => handleDimensionsChange('length', e.target.value)}
                  status={errors['shipping.dimensions.length'] ? 'error' : ''}
                />
                {renderError('shipping.dimensions.length')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Width</label>
                <Input
                  size="large"
                  value={formData.shipping.dimensions.width}
                  onChange={(e) => handleDimensionsChange('width', e.target.value)}
                  status={errors['shipping.dimensions.width'] ? 'error' : ''}
                />
                {renderError('shipping.dimensions.width')}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <Input
                  size="large"
                  value={formData.shipping.dimensions.height}
                  onChange={(e) => handleDimensionsChange('height', e.target.value)}
                  status={errors['shipping.dimensions.height'] ? 'error' : ''}
                />
                {renderError('shipping.dimensions.height')}
              </div>
            </div>
            <Checkbox
              checked={formData.shipping.free_shipping}
              onChange={(e) => handleShippingChange('free_shipping', e.target.checked)}
            >
              Free Shipping
            </Checkbox>
          </div>
        </Card>

        {/* SEO Section */}
        <Card title="SEO" className="mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Meta Title</label>
              <Input
                size="large"
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
                  size="large"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Enter keyword"
                />
                <Button type="primary" size="large" onClick={addKeyword}>
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
              {renderError('seo.keywords')}
            </div>
          </div>
        </Card>

        {/* Status Section */}
        <Card title="Status" className="mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                size="large"
                value={formData.status}
                onChange={(value) => handleChange('status', value)}
                className="w-full"
                status={errors.status ? 'error' : ''}
              >
                <Option value="draft">Draft</Option>
                <Option value="pending_verification">Pending Verification</Option>
                <Option value="active">Active</Option>
                <Option value="rejected">Rejected</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="archived">Archived</Option>
              </Select>
              {renderError('status')}
            </div>
            {user?.role === 'SuperAdmin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                <Select
                  size="large"
                  value={formData.verification_status.status}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      verification_status: { ...formData.verification_status, status: value },
                    })
                  }
                  className="w-full"
                  status={errors['verification_status.status'] ? 'error' : ''}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
                {renderError('verification_status.status')}
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
                        status={errors['verification_status.rejection_reason'] ? 'error' : ''}
                      />
                      {renderError('verification_status.rejection_reason')}
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
                        status={errors['verification_status.suggestion'] ? 'error' : ''}
                      />
                      {renderError('verification_status.suggestion')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Color Variants Section */}
        <Card title="Color Variants * (At least one)" className="mb-6">
          {formData.color_variants.map((variant, index) => {
            const colorNameError = errors[`color_variants.${index}.color_name`];
            const imagesError = errors[`color_variants.${index}.images`];
            const removable = formData.color_variants.length > 1;
            return (
              <ColorVariantItem
                key={index}
                variant={variant}
                index={index}
                colorNameError={colorNameError}
                imagesError={imagesError}
                removable={removable}
                onUpdateField={(field, value) => handleUpdateVariantField(index, field, value)}
                onRemoveVariant={() => handleRemoveVariant(index)}
                onRemoveImage={(imageIndex) => handleRemoveImage(index, imageIndex)}
                onUpdateAlt={(imageIndex, value) => handleUpdateImageAlt(index, imageIndex, value)}
                onDrop={handleVariantImageDrop}
              />
            );
          })}
          <Button type="primary" onClick={addColorVariant}>
            <FiPlus size={16} className="inline mr-2" /> Add Color Variant
          </Button>
          {renderError('color_variants')}
        </Card>

        {/* 3D Model Section */}
        <Card title="3D Model (Optional)" className="mb-6">
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
            <>
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
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">3D Model Alt Text</label>
                <Input
                  size="large"
                  value={formData.three_d_model?.alt_text || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      three_d_model: { ...prev.three_d_model, alt_text: e.target.value },
                    }))
                  }
                  status={errors.three_d_model ? 'error' : ''}
                />
                {renderError('three_d_model')}
              </div>
            </>
          )}
        </Card>

        {/* Documents Section */}
        <Card title="Documents * (At least one)" className="mb-6">
          <div className="grid grid-cols-3 gap-4">
            {['product_invoice', 'product_certificate', 'quality_report'].map((field) => {
              const { getRootProps, getInputProps } = getDocumentDropzoneProps(field);
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
                          setFormData((prev) => ({
                            ...prev,
                            documents: { ...prev.documents, [field]: null },
                          }))
                        }
                      >
                        <FiX size={12} />
                      </Button>
                    </div>
                  )}
                  {renderError(`documents.${field}`)}
                </div>
              );
            })}
          </div>
          {renderError('documents')}
        </Card>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Button type="primary" htmlType="submit" size="large">
            <FiPlus size={20} className="inline mr-2" /> Add Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;