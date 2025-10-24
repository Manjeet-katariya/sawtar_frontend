import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiX, FiRefreshCw, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import CustomTable from '../../../CMS/pages/custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../../manageApi/utils/sweetAlert';

const AddMaterial = () => {
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
  const [loadingTable, setLoadingTable] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
        };

        if (filters.search) params.search = filters.search;

        const response = await apiService.get('/materials', { params });

        setMaterials(response.materials || []);
        setPagination({
          currentPage: response.pagination?.page || 1,
          totalPages: Math.ceil(response.pagination?.total / response.pagination?.limit) || 1,
          totalResults: response.pagination?.total || 0,
          itemsPerPage: response.pagination?.limit || 10,
        });
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to fetch materials', 'error');
        setMaterials([]);
      } finally {
        setLoadingTable(false);
      }
    },
    []
  );

  // Handle input changes for add form
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'description') {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else if (name === 'properties' && index !== null) {
      const updatedProperties = [...form.properties];
      updatedProperties[index] = value;
      setForm((prev) => ({ ...prev, properties: updatedProperties }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle input changes for edit form
  const handleEditChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'description') {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    } else if (name === 'properties' && index !== null) {
      const updatedProperties = [...editForm.properties];
      updatedProperties[index] = value;
      setEditForm((prev) => ({ ...prev, properties: updatedProperties }));
    }
    setEditErrors((prev) => ({ ...prev, [name]: '' }));
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
      showToast('At least one property is required', 'error');
    }
  };

  // Remove a property input field for edit form
  const removeEditPropertyField = (index) => {
    if (editForm.properties.length > 1) {
      const updatedProperties = editForm.properties.filter((_, i) => i !== index);
      setEditForm((prev) => ({ ...prev, properties: updatedProperties }));
    } else {
      showToast('At least one property is required', 'error');
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
      setForm({ name: '', description: '', properties: [''] }); // Reset form
      setRefreshTrigger((prev) => prev + 1); // Refresh table
    } catch (error) {
      showErrorAlert('Error', error.response?.data?.message || 'Failed to create material');
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
      setRefreshTrigger((prev) => prev + 1); // Refresh table
    } catch (error) {
      showErrorAlert('Error', error.response?.data?.message || 'Failed to update material');
    } finally {
      setIsLoadingForm(false);
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

  // Handle delete material with SweetAlert
  const handleDelete = async (materialId) => {
    const result = await showConfirmDialog(
      'Are you sure?',
      "You won't be able to revert this!",
      'Yes, delete it!'
    );
    if (result.isConfirmed) {
      try {
        await apiService.delete(`/materials/${materialId}`);
        showSuccessAlert('Deleted!', 'Your material has been deleted.');
        fetchMaterials(pagination.currentPage, pagination.itemsPerPage, filters);
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to delete material');
      }
    }
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
      properties: item.properties || [''],
    });
    setShowEditModal(true);
  };

  // Fetch data when refreshTrigger changes
  useEffect(() => {
    fetchMaterials(pagination.currentPage, pagination.itemsPerPage, filters);
  }, [refreshTrigger, fetchMaterials]);

  // Render error messages
  const renderError = (field, errorsObj) => {
    return errorsObj[field] ? (
      <p className="text-red-500 text-xs italic mt-1">{errorsObj[field]}</p>
    ) : null;
  };

  // Table columns for materials
  const materialColumns = [
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
          {value ? new Date(value).toLocaleDateString('en-GB') : '--'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openViewModal(item)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            title="View Details"
          >
            <FiEye className="text-lg" />
          </button>
          <button
            onClick={() => openEditModal(item)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            title="Edit Material"
          >
            <FiEdit className="text-lg" />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="text-red-600 hover:text-red-800 p-1 rounded"
            title="Delete Material"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Materials Management</h1>

      {/* Add Material Form */}
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Material</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="name"
            >
              Material Name *
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Cotton"
            />
            {renderError('name', errors)}
          </div>

          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.description ? 'border-red-500' : 'border-gray-200'
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Soft and breathable fabric"
            />
            {renderError('description', errors)}
          </div>

          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="properties"
            >
              Properties *
            </label>
            {form.properties.map((prop, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    errors.properties ? 'border-red-500' : 'border-gray-200'
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  name="properties"
                  type="text"
                  value={prop}
                  onChange={(e) => handleChange(e, index)}
                  placeholder={`e.g. ${['Soft', 'Durable', 'Lightweight'][index] || 'Property'}`}
                />
                {form.properties.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePropertyField(index)}
                    className="ml-2 text-red-600 hover:text-red-800 p-1"
                    title="Remove Property"
                  >
                    <FiX className="text-lg" />
                  </button>
                )}
              </div>
            ))}
            {renderError('properties', errors)}
            <button
              type="button"
              onClick={addPropertyField}
              className="flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-800"
            >
              <FiPlus className="text-lg" /> Add Another Property
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isLoadingForm ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isLoadingForm}
            >
              {isLoadingForm ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Material'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Materials List */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Materials List</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200"
          title="Refresh data"
        >
          <FiRefreshCw className={`text-lg ${loadingTable ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Materials</div>
          <div className="text-2xl font-bold text-gray-900">{pagination.totalResults}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <CustomTable
          columns={materialColumns}
          data={materials}
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
          emptyMessage="No materials found."
        />
      </div>

      {/* View Modal */}
      {showViewModal && selectedMaterial && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Material Details</h2>
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
              <p>{new Date(selectedMaterial.created_at).toLocaleDateString('en-GB')}</p>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedMaterial && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-white rounded-lg p-8 max-w-md w-full overflow-y-auto max-h-96">
            <h2 className="text-xl font-semibold mb-4">Edit Material</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="edit-name"
                >
                  Material Name *
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    editErrors.name ? 'border-red-500' : 'border-gray-200'
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="edit-name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="e.g. Cotton"
                />
                {renderError('name', editErrors)}
              </div>

              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="edit-description"
                >
                  Description
                </label>
                <textarea
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    editErrors.description ? 'border-red-500' : 'border-gray-200'
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="edit-description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="e.g. Soft and breathable fabric"
                />
                {renderError('description', editErrors)}
              </div>

              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="edit-properties"
                >
                  Properties *
                </label>
                {editForm.properties.map((prop, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                        editErrors.properties ? 'border-red-500' : 'border-gray-200'
                      } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                      name="properties"
                      type="text"
                      value={prop}
                      onChange={(e) => handleEditChange(e, index)}
                      placeholder={`e.g. ${['Soft', 'Durable', 'Lightweight'][index] || 'Property'}`}
                    />
                    {editForm.properties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEditPropertyField(index)}
                        className="ml-2 text-red-600 hover:text-red-800 p-1"
                        title="Remove Property"
                      >
                        <FiX className="text-lg" />
                      </button>
                    )}
                  </div>
                ))}
                {renderError('properties', editErrors)}
                <button
                  type="button"
                  onClick={addEditPropertyField}
                  className="flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="text-lg" /> Add Another Property
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isLoadingForm ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoadingForm}
                >
                  {isLoadingForm ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Material'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMaterial;