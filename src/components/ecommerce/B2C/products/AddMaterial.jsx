
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiRefreshCw, FiEye, FiEdit, FiTrash2, FiRotateCcw, FiPlus, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { Button, Input, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CustomTable from '../../../CMS/pages/custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../../manageApi/utils/sweetAlert';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const AddMaterial = () => {
  const navigate = useNavigate();

  // Form state for adding materials
  const [form, setForm] = useState({
    name: '',
    description: '',
    properties: [''],
  });
  const [errors, setErrors] = useState({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Table state for listing materials
  const [materials, setMaterials] = useState([]);
  const [trashedMaterials, setTrashedMaterials] = useState([]);
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
    status: 1, // Default to active materials
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('active');

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    properties: [''],
  });
  const [editErrors, setEditErrors] = useState({});

  // Fetch materials
  const fetchMaterials = useCallback(
    async (page = 1, itemsPerPage = 10, filters = {}) => {
      setLoadingTable(true);
      try {
        const params = {
          page,
          limit: itemsPerPage,
          status: filters.status,
        };
        if (filters.search) params.search = filters.search;

        const response = await apiService.get('/materials', params);

        if (filters.status === 0) {
          setTrashedMaterials(response.materials || []);
          setMaterials([]);
        } else {
          setMaterials(response.materials || []);
          setTrashedMaterials([]);
        }
        setPagination({
          currentPage: response.pagination?.page || 1,
          totalPages: Math.ceil(response.pagination?.total / response.pagination?.limit) || 1,
          totalResults: response.pagination?.total || 0,
          itemsPerPage: response.pagination?.limit || 10,
        });
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to fetch materials');
        if (filters.status === 0) {
          setTrashedMaterials([]);
        } else {
          setMaterials([]);
        }
      } finally {
        setLoadingTable(false);
      }
    },
    []
  );

  // Handle input changes for add form
  const handleChange = (field, value, index = null) => {
    if (field === 'properties' && index !== null) {
      const updatedProperties = [...form.properties];
      updatedProperties[index] = value;
      setForm((prev) => ({ ...prev, properties: updatedProperties }));
      setErrors((prev) => ({ ...prev, properties: '' }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle input changes for edit form
  const handleEditChange = (field, value, index = null) => {
    if (field === 'properties' && index !== null) {
      const updatedProperties = [...editForm.properties];
      updatedProperties[index] = value;
      setEditForm((prev) => ({ ...prev, properties: updatedProperties }));
      setEditErrors((prev) => ({ ...prev, properties: '' }));
    } else {
      setEditForm((prev) => ({ ...prev, [field]: value }));
      setEditErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Add a new property input field for add form
  const addPropertyField = () => {
    setForm((prev) => ({ ...prev, properties: [...prev.properties, ''] }));
  };

  // Add a new property input field for edit form
  const addEditPropertyField = () => {
    setEditForm((prev) => ({ ...prev, properties: [...prev.properties, ''] }));
  };

  // Remove a property input field for add form
  const removePropertyField = (index) => {
    if (form.properties.length > 1) {
      const updatedProperties = form.properties.filter((_, i) => i !== index);
      setForm((prev) => ({ ...prev, properties: updatedProperties }));
    } else {
      showErrorAlert('Error', 'At least one property is required');
    }
  };

  // Remove a property input field for edit form
  const removeEditPropertyField = (index) => {
    if (editForm.properties.length > 1) {
      const updatedProperties = editForm.properties.filter((_, i) => i !== index);
      setEditForm((prev) => ({ ...prev, properties: updatedProperties }));
    } else {
      showErrorAlert('Error', 'At least one property is required');
    }
  };

  // Validate add form
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Material name is required';
    }
    const validProperties = form.properties
      .map((prop) => prop.trim())
      .filter((prop) => prop !== '');
    if (validProperties.length === 0) {
      newErrors.properties = 'At least one valid property is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors = {};
    if (!editForm.name.trim()) {
      newErrors.name = 'Material name is required';
    }
    const validProperties = editForm.properties
      .map((prop) => prop.trim())
      .filter((prop) => prop !== '');
    if (validProperties.length === 0) {
      newErrors.properties = 'At least one valid property is required';
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
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        properties: form.properties
          .map((prop) => prop.trim())
          .filter((prop) => prop !== ''),
      };
      await apiService.post('/materials', payload);
      showSuccessAlert('Success', 'Material created successfully');
      setForm({ name: '', description: '', properties: [''] });
      setErrors({});
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors.reduce((acc, err) => ({ ...acc, [err.field]: err.message }), {}));
      } else {
        setErrors({ general: errorData?.message || 'Failed to create material' });
        showErrorAlert('Error', errorData?.message || 'Failed to create material');
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
      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        properties: editForm.properties
          .map((prop) => prop.trim())
          .filter((prop) => prop !== ''),
      };
      await apiService.put(`/materials/${selectedMaterial._id}`, payload);
      showSuccessAlert('Success', 'Material updated successfully');
      setShowEditModal(false);
      setEditErrors({});
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setEditErrors(errorData.errors.reduce((acc, err) => ({ ...acc, [err.field]: err.message }), {}));
      } else {
        setEditErrors({ general: errorData?.message || 'Failed to update material' });
        showErrorAlert('Error', errorData?.message || 'Failed to update material');
      }
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Handle soft delete
  const handleSoftDelete = async (materialId) => {
    const result = await showConfirmDialog(
      'Are you sure?',
      'This material will be moved to the trash. You can restore it later.',
      'Yes, move to trash!'
    );
    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await apiService.delete(`/materials/${materialId}`);
        showSuccessAlert('Moved to Trash', 'Material has been moved to the trash.');
        fetchMaterials(pagination.currentPage, pagination.itemsPerPage, filters);
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to move material to trash');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle restore
  const handleRestore = async (materialId) => {
    const result = await showConfirmDialog(
      'Restore Material?',
      'This will restore the material to active status.',
      'Yes, restore it!'
    );
    if (result.isConfirmed) {
      try {
        await apiService.post(`/materials/${materialId}/restore`);
        showSuccessAlert('Restored', 'Material has been restored successfully.');
        fetchMaterials(pagination.currentPage, pagination.itemsPerPage, filters);
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to restore material');
      }
    }
  };

  // Handle page change
  const handlePageChange = (page, itemsPerPage) => {
    fetchMaterials(page, itemsPerPage, filters);
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchMaterials(1, pagination.itemsPerPage, newFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Open view modal
  const openViewModal = (item) => {
    setSelectedMaterial(item);
    setShowViewModal(true);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedMaterial(item);
    setEditForm({
      name: item.name,
      description: item.description || '',
      properties: item.properties && item.properties.length > 0 ? item.properties : [''],
    });
    setShowEditModal(true);
  };

  // Fetch data when refreshTrigger or filters change
  useEffect(() => {
    fetchMaterials(pagination.currentPage, pagination.itemsPerPage, filters);
  }, [refreshTrigger, fetchMaterials, filters]);

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

  // Table columns for materials
  const materialColumns = useMemo(
    () => [
    
      {
        key: 'name',
        title: 'Material Name',
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
        key: 'properties',
        title: 'Properties',
        sortable: false,
        render: (properties) => (
          <div className="flex flex-wrap gap-1">
            {properties && properties.length > 0 ? (
              properties.map((prop, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                >
                  {prop}
                </span>
              ))
            ) : (
              '--'
            )}
          </div>
        ),
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
                  title="Edit Material"
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
                title="Restore Material"
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
        <h1 className="text-3xl font-bold text-gray-800">Materials Management</h1>
      </div>

      {/* Add Material Form */}
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Material</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <p className="text-red-500 text-xs italic mb-4">{errors.general}</p>
          )}
          <div className="mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Material Name *
            </label>
            <Input
              size="large"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Cotton"
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
              placeholder="e.g. Soft and breathable fabric"
              rows={4}
              status={errors.description ? 'error' : ''}
            />
            {renderError('description', errors)}
          </div>

          <div className="mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Properties *
            </label>
            {form.properties.map((prop, index) => (
              <div key={index} className="flex items-center mb-2">
                <Input
                  size="large"
                  value={prop}
                  onChange={(e) => handleChange('properties', e.target.value, index)}
                  placeholder={`e.g. ${['Soft', 'Durable', 'Lightweight'][index] || 'Property'}`}
                  status={errors.properties ? 'error' : ''}
                />
                {form.properties.length > 1 && (
                  <Button
                    type="link"
                    icon={<FiX />}
                    onClick={() => removePropertyField(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                    title="Remove Property"
                  />
                )}
              </div>
            ))}
            {renderError('properties', errors)}
            <Button
              type="link"
              icon={<FiPlus />}
              onClick={addPropertyField}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add Another Property
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoadingForm}
              disabled={isLoadingForm}
            >
              {isLoadingForm ? 'Creating...' : 'Create Material'}
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
            Active Materials
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm text-gray-700 border-b-2 ${
              activeTab === 'trashed' ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }`}
            onClick={() => handleTabChange('trashed')}
          >
            Trashed Materials
          </button>
        </div>
      </div>

   

   

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <CustomTable
          columns={materialColumns}
          data={(activeTab === 'active' ? materials : trashedMaterials).map((item, index) => ({
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
              placeholder: 'Search by material name...',
            },
          ]}
          emptyMessage={activeTab === 'active' ? 'No active materials found.' : 'No trashed materials found.'}
        />
      </div>

      {/* View Modal */}
      <Modal
        title="Material Details"
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowViewModal(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedMaterial && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Name:</label>
              <p>{selectedMaterial.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Description:</label>
              <p>{selectedMaterial.description || '--'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Properties:</label>
              <div className="flex flex-wrap gap-1">
                {selectedMaterial.properties && selectedMaterial.properties.length > 0 ? (
                  selectedMaterial.properties.map((prop, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                    >
                      {prop}
                    </span>
                  ))
                ) : (
                  '--'
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Created At:</label>
              <p>
                {selectedMaterial.created_at
                  ? format(new Date(selectedMaterial.created_at), 'dd/MM/yyyy')
                  : '--'}
              </p>
            </div>
            {selectedMaterial.status === 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Deleted At:</label>
                <p>
                  {selectedMaterial.deletedAt
                    ? format(new Date(selectedMaterial.deletedAt), 'dd/MM/yyyy')
                    : '--'}
                </p>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Material"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        {selectedMaterial && (
          <form onSubmit={handleEditSubmit}>
            {editErrors.general && (
              <p className="text-red-500 text-xs italic mb-4">{editErrors.general}</p>
            )}
            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Material Name *
              </label>
              <Input
                size="large"
                value={editForm.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                placeholder="e.g. Cotton"
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
                placeholder="e.g. Soft and breathable fabric"
                rows={4}
                status={editErrors.description ? 'error' : ''}
              />
              {renderError('description', editErrors)}
            </div>

            <div className="mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Properties *
              </label>
              {editForm.properties.map((prop, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    size="large"
                    value={prop}
                    onChange={(e) => handleEditChange('properties', e.target.value, index)}
                    placeholder={`e.g. ${['Soft', 'Durable', 'Lightweight'][index] || 'Property'}`}
                    status={editErrors.properties ? 'error' : ''}
                  />
                  {editForm.properties.length > 1 && (
                    <Button
                      type="link"
                      icon={<FiX />}
                      onClick={() => removeEditPropertyField(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                      title="Remove Property"
                    />
                  )}
                </div>
              ))}
              {renderError('properties', editErrors)}
              <Button
                type="link"
                icon={<FiPlus />}
                onClick={addEditPropertyField}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Add Another Property
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoadingForm}
                disabled={isLoadingForm}
              >
                {isLoadingForm ? 'Updating...' : 'Update Material'}
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

export default AddMaterial;
