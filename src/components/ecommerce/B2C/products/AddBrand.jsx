
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiRefreshCw, FiEye, FiEdit, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import { format } from 'date-fns';
import { Button, Input, Upload, Modal, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import CustomTable from '../../../CMS/pages/custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../../manageApi/utils/sweetAlert';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const AddBrand = () => {
  const navigate = useNavigate();

  // Form state for adding brands
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    country: '',
    logo: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  // Table state for listing brands
  const [brands, setBrands] = useState([]);
  const [trashedBrands, setTrashedBrands] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 1, // Default to active brands
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('active');

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    website: '',
    country: '',
    logo: null,
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLogoPreview, setEditLogoPreview] = useState(null);

  // Fetch brands
  const fetchBrands = useCallback(
    async (page = 1, itemsPerPage = 10, filters = {}) => {
      setLoadingTable(true);
      try {
        const params = {
          page,
          limit: itemsPerPage,
          status: filters.status,
        };
        if (filters.search) params.search = filters.search;

        const response = await apiService.get('/brands',  params );

        if (filters.status === 0) {
          setTrashedBrands(response.brands || []);
          setBrands([]);
        } else {
          setBrands(response.brands || []);
          setTrashedBrands([]);
        }
        setPagination({
          currentPage: response.pagination?.page || 1,
          totalPages: Math.ceil(response.pagination?.total / response.pagination?.limit) || 1,
          totalResults: response.pagination?.total || 0,
          itemsPerPage: response.pagination?.limit || 10,
        });
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to fetch brands');
        if (filters.status === 0) {
          setTrashedBrands([]);
        } else {
          setBrands([]);
        }
      } finally {
        setLoadingTable(false);
      }
    },
    []
  );

  // Handle input changes for add form
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Handle input changes for edit form
  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setEditErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validate add form
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Brand name is required';
    }
    if (form.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(form.website.trim())) {
      newErrors.website = 'Invalid website URL';
    }
    if (form.country && !form.country.trim()) {
      newErrors.country = 'Country cannot be empty';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors = {};
    if (!editForm.name.trim()) {
      newErrors.name = 'Brand name is required';
    }
    if (editForm.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(editForm.website.trim())) {
      newErrors.website = 'Invalid website URL';
    }
    if (editForm.country && !editForm.country.trim()) {
      newErrors.country = 'Country cannot be empty';
    }
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoadingForm(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('description', form.description.trim());
      formData.append('website', form.website.trim());
      formData.append('country', form.country.trim());
      if (form.logo) formData.append('logo', form.logo);

      await apiService.upload('/brands', formData);
      showSuccessAlert('Success', 'Brand created successfully');
      setForm({ name: '', description: '', website: '', country: '', logo: null });
      setLogoPreview(null);
      setErrors({});
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors.reduce((acc, err) => ({ ...acc, [err.field]: err.message }), {}));
      } else {
        setErrors({ general: errorData?.message || 'Failed to create brand' });
        showErrorAlert('Error', errorData?.message || 'Failed to create brand');
      }
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) {
      return;
    }

    setIsLoadingForm(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name.trim());
      formData.append('description', editForm.description.trim());
      formData.append('website', editForm.website.trim());
      formData.append('country', editForm.country.trim());
      if (editForm.logo) formData.append('logo', editForm.logo);

      await apiService.put(`/brands/${selectedBrand._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSuccessAlert('Success', 'Brand updated successfully');
      setShowEditModal(false);
      setEditLogoPreview(null);
      setEditErrors({});
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setEditErrors(errorData.errors.reduce((acc, err) => ({ ...acc, [err.field]: err.message }), {}));
      } else {
        setEditErrors({ general: errorData?.message || 'Failed to update brand' });
        showErrorAlert('Error', errorData?.message || 'Failed to update brand');
      }
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Handle soft delete
  const handleSoftDelete = async (brandId) => {
    const result = await showConfirmDialog(
      'Are you sure?',
      'This brand will be moved to the trash. You can restore it later.',
      'Yes, move to trash!'
    );
    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await apiService.delete(`/brands/${brandId}`);
        showSuccessAlert('Moved to Trash', 'Brand has been moved to the trash.');
        fetchBrands(pagination.currentPage, pagination.itemsPerPage, filters);
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to move brand to trash');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle restore
  const handleRestore = async (brandId) => {
    const result = await showConfirmDialog(
      'Restore Brand?',
      'This will restore the brand to active status.',
      'Yes, restore it!'
    );
    if (result.isConfirmed) {
      try {
        await apiService.post(`/brands/${brandId}/restore`);
        showSuccessAlert('Restored', 'Brand has been restored successfully.');
        fetchBrands(pagination.currentPage, pagination.itemsPerPage, filters);
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to restore brand');
      }
    }
  };

  // Handle page change
  const handlePageChange = (page, itemsPerPage) => {
    fetchBrands(page, itemsPerPage, filters);
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchBrands(1, pagination.itemsPerPage, newFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Open view modal
  const openViewModal = (item) => {
    setSelectedBrand(item);
    setShowViewModal(true);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedBrand(item);
    setEditForm({
      name: item.name,
      description: item.description || '',
      website: item.website || '',
      country: item.country || '',
      logo: null,
    });
    setEditLogoPreview(null);
    setShowEditModal(true);
  };

  // Fetch data when refreshTrigger changes
  useEffect(() => {
    fetchBrands(pagination.currentPage, pagination.itemsPerPage, filters);
  }, [refreshTrigger, fetchBrands, filters]);

  // Clean up URL object for logo preview
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (editLogoPreview) URL.revokeObjectURL(editLogoPreview);
    };
  }, [logoPreview, editLogoPreview]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters((prev) => ({
      ...prev,
      status: tab === 'active' ? 1 : 0,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setRefreshTrigger((prev) => prev + 1);
  };

  // Render error messages
  const renderError = (field, errorsObj) => {
    return errorsObj[field] ? (
      <p className="text-red-500 text-xs italic mt-1">{errorsObj[field]}</p>
    ) : null;
  };

  // Ant Design Upload props for add form
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        message.error('Logo must be an image (JPEG, PNG, JPG, GIF)');
        setErrors((prev) => ({ ...prev, logo: 'Logo must be an image (JPEG, PNG, JPG, GIF)' }));
        return false;
      }
      if (!isLt2M) {
        message.error('Logo size must be less than 2MB');
        setErrors((prev) => ({ ...prev, logo: 'Logo size must be less than 2MB' }));
        return false;
      }
      setForm((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, logo: '' }));
      return false; // Prevent automatic upload
    },
    fileList: form.logo ? [{ uid: '-1', name: form.logo.name, status: 'done', url: logoPreview }] : [],
    onRemove: () => {
      setForm((prev) => ({ ...prev, logo: null }));
      setLogoPreview(null);
    },
    listType: 'picture',
    maxCount: 1,
  };

  // Ant Design Upload props for edit form
  const editUploadProps = {
    beforeUpload: (file) => {
      const isImage = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        message.error('Logo must be an image (JPEG, PNG, JPG, GIF)');
        setEditErrors((prev) => ({ ...prev, logo: 'Logo must be an image (JPEG, PNG, JPG, GIF)' }));
        return false;
      }
      if (!isLt2M) {
        message.error('Logo size must be less than 2MB');
        setEditErrors((prev) => ({ ...prev, logo: 'Logo size must be less than 2MB' }));
        return false;
      }
      setEditForm((prev) => ({ ...prev, logo: file }));
      setEditLogoPreview(URL.createObjectURL(file));
      setEditErrors((prev) => ({ ...prev, logo: '' }));
      return false; // Prevent automatic upload
    },
    fileList: editForm.logo ? [{ uid: '-1', name: editForm.logo.name, status: 'done', url: editLogoPreview }] : [],
    onRemove: () => {
      setEditForm((prev) => ({ ...prev, logo: null }));
      setEditLogoPreview(null);
    },
    listType: 'picture',
    maxCount: 1,
  };

  // Table columns for brands
  const brandColumns = useMemo(
    () => [
    
      {
        key: 'logo',
        title: 'Logo',
        sortable: false,
        render: (value) =>
          value ? (
            <img
              src={`http://localhost:5000/${value}`}
              alt="Brand Logo"
              className="w-12 h-12 object-contain"
            />
          ) : (
            '--'
          ),
      },
      {
        key: 'name',
        title: 'Brand Name',
        sortable: true,
        filterable: true,
        render: (value) => <span className="text-gray-900">{value || '--'}</span>,
      },
      {
        key: 'description',
        title: 'Description',
        sortable: false,
        render: (value) => <span className="text-gray-900">{value || '--'}</span>,
      },
      {
        key: 'website',
        title: 'Website',
        sortable: false,
        render: (value) =>
          value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {value}
            </a>
          ) : (
            '--'
          ),
      },
      {
        key: 'country',
        title: 'Country',
        sortable: true,
        render: (value) => <span className="text-gray-900">{value || '--'}</span>,
      },
      {
        key: 'created_at',
        title: 'Created At',
        sortable: true,
        render: (value) => (
          <span className="text-gray-900">
            {value ? format(new Date(value), 'dd/MM/yyyy') : '--'}
          </span>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (value, item) => (
          <div className="flex space-x-2">
            <Button
              icon={<FiEye />}
              onClick={() => openViewModal(item)}
              type="link"
              className="text-blue-600 hover:text-blue-800"
              title="View Details"
            />
            {activeTab === 'active' && (
              <>
                <Button
                  icon={<FiEdit />}
                  onClick={() => openEditModal(item)}
                  type="link"
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Brand"
                />
                <Button
                  icon={<FiTrash2 />}
                  onClick={() => handleSoftDelete(item._id)}
                  type="link"
                  className={`text-red-600 hover:text-red-800 ${isDeleting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  title="Move to Trash"
                  disabled={isDeleting}
                />
              </>
            )}
            {activeTab === 'trashed' && (
              <Button
                icon={<FiRotateCcw />}
                onClick={() => handleRestore(item._id)}
                type="link"
                className="text-green-600 hover:text-green-800"
                title="Restore Brand"
              />
            )}
          </div>
        ),
      },
    ],
    [isDeleting, activeTab]
  );

  return (
    <div className="min-h-screen">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mr-4"
          type="primary"
          shape="circle"
        />
        <h1 className="text-3xl font-bold text-gray-800">Brands Management</h1>
      </div>

      {/* Add Brand Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Brand</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <p className="text-red-500 text-xs italic mb-4">{errors.general}</p>
          )}
          <div className="mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Brand Name *
            </label>
            <Input
              size="large"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Nike"
              status={errors.name ? 'error' : ''}
            />
            {renderError('name', errors)}
          </div>

          <div className="mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Description
            </label>
            <TextArea
              size="large"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g. Leading sportswear brand"
              rows={4}
              status={errors.description ? 'error' : ''}
            />
            {renderError('description', errors)}
          </div>

          <div className="mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Website
            </label>
            <Input
              size="large"
              value={form.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="e.g. https://www.nike.com"
              status={errors.website ? 'error' : ''}
            />
            {renderError('website', errors)}
          </div>

          <div className="mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Country
            </label>
            <Input
              size="large"
              value={form.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="e.g. USA"
              status={errors.country ? 'error' : ''}
            />
            {renderError('country', errors)}
          </div>

          <div className="mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Logo
            </label>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Logo (JPEG, PNG, JPG, GIF, max 2MB)</Button>
            </Upload>
            {renderError('logo', errors)}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoadingForm}
              disabled={isLoadingForm}
            >
              {isLoadingForm ? 'Creating...' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-semibold text-sm text-gray-700 border-b-2 ${
              activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }`}
            onClick={() => handleTabChange('active')}
          >
            Active Brands
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm text-gray-700 border-b-2 ${
              activeTab === 'trashed' ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }`}
            onClick={() => handleTabChange('trashed')}
          >
            Trashed Brands
          </button>
        </div>
      </div>

      {/* Brands List */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {activeTab === 'active' ? 'Active Brands' : 'Trashed Brands'}
        </h2>
       
      </div>

      {/* Stats Summary */}
  
      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <CustomTable
          columns={brandColumns}
          data={(activeTab === 'active' ? brands : trashedBrands).map((item, index) => ({
            ...item,
            key: item._id || index,
          }))}
          totalItems={pagination.totalResults}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onFilter={handleFilter}
          loading={loadingTable}
          filters={[
            {
              key: 'search',
              type: 'text',
              placeholder: 'Search by brand name...',
            },
          ]}
          emptyMessage={activeTab === 'active' ? 'No active brands found.' : 'No trashed brands found.'}
        />
      </div>

      {/* View Modal */}
      <Modal
        title="Brand Details"
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowViewModal(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedBrand && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Name:</label>
              <p>{selectedBrand.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Description:</label>
              <p>{selectedBrand.description || '--'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Website:</label>
              <p>
                {selectedBrand.website ? (
                  <a
                    href={selectedBrand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedBrand.website}
                  </a>
                ) : (
                  '--'
                )}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Country:</label>
              <p>{selectedBrand.country || '--'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Logo:</label>
              {selectedBrand.logo ? (
                <img
                  src={`http://localhost:5000/${selectedBrand.logo}`}
                  alt="Brand Logo"
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <p>--</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Created At:</label>
              <p>
                {selectedBrand.created_at
                  ? format(new Date(selectedBrand.created_at), 'dd/MM/yyyy')
                  : '--'}
              </p>
            </div>
            {selectedBrand.status === 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Deleted At:</label>
                <p>
                  {selectedBrand.deletedAt
                    ? format(new Date(selectedBrand.deletedAt), 'dd/MM/yyyy')
                    : '--'}
                </p>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Brand"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        {selectedBrand && (
          <form onSubmit={handleEditSubmit}>
            {editErrors.general && (
              <p className="text-red-500 text-xs italic mb-4">{editErrors.general}</p>
            )}
            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Brand Name *
              </label>
              <Input
                size="large"
                value={editForm.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                placeholder="e.g. Nike"
                status={editErrors.name ? 'error' : ''}
              />
              {renderError('name', editErrors)}
            </div>

            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Description
              </label>
              <TextArea
                size="large"
                value={editForm.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
                placeholder="e.g. Leading sportswear brand"
                rows={4}
                status={editErrors.description ? 'error' : ''}
              />
              {renderError('description', editErrors)}
            </div>

            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Website
              </label>
              <Input
                size="large"
                value={editForm.website}
                onChange={(e) => handleEditChange('website', e.target.value)}
                placeholder="e.g. https://www.nike.com"
                status={editErrors.website ? 'error' : ''}
              />
              {renderError('website', editErrors)}
            </div>

            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Country
              </label>
              <Input
                size="large"
                value={editForm.country}
                onChange={(e) => handleEditChange('country', e.target.value)}
                placeholder="e.g. USA"
                status={editErrors.country ? 'error' : ''}
              />
              {renderError('country', editErrors)}
            </div>

            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Logo
              </label>
              <Upload {...editUploadProps}>
                <Button icon={<UploadOutlined />}>Upload Logo (JPEG, PNG, JPG, GIF, max 2MB)</Button>
              </Upload>
              {selectedBrand.logo && !editForm.logo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Logo:</p>
                  <img
                    src={`http://localhost:5000/${selectedBrand.logo}`}
                    alt="Brand Logo"
                    className="w-24 h-24 object-contain"
                  />
                </div>
              )}
              {renderError('logo', editErrors)}
            </div>

            <div className="flex items-center justify-between">
              <Button type="primary" htmlType="submit" size="large" loading={isLoadingForm} disabled={isLoadingForm}>
                {isLoadingForm ? 'Updating...' : 'Update Brand'}
              </Button>
              <Button size="large" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AddBrand;
