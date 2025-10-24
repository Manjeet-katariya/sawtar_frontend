import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FiRefreshCw, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import CustomTable from '../../../CMS/pages/custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../../manageApi/utils/sweetAlert';

const AddBrand = () => {
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
  const fileInputRef = useRef(null);

  // Table state for listing brands
  const [brands, setBrands] = useState([]);
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
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  const editFileInputRef = useRef(null);

  // Fetch brands
  const fetchBrands = useCallback(
    async (page = 1, itemsPerPage = 10, filters = {}) => {
      setLoadingTable(true);
      try {
        const params = {
          page,
          limit: itemsPerPage,
        };
        if (filters.search) params.search = filters.search;

        const response = await apiService.get('/brands', { params });

        setBrands(response.brands || []);
        setPagination({
          currentPage: response.pagination?.page || 1,
          totalPages: Math.ceil(response.pagination?.total / response.pagination?.limit) || 1,
          totalResults: response.pagination?.total || 0,
          itemsPerPage: response.pagination?.limit || 10,
        });
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to fetch brands');
        setBrands([]);
      } finally {
        setLoadingTable(false);
      }
    },
    []
  );

  // Handle input changes for add form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      const file = files[0];
      if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!allowedTypes.includes(file.type)) {
          setErrors((prev) => ({ ...prev, logo: 'Logo must be an image (JPEG, PNG, JPG, GIF)' }));
          return;
        }
        if (file.size > maxSize) {
          setErrors((prev) => ({ ...prev, logo: 'Logo size must be less than 2MB' }));
          return;
        }
      }
      setForm((prev) => ({ ...prev, logo: file || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle input changes for edit form
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      const file = files[0];
      if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!allowedTypes.includes(file.type)) {
          setEditErrors((prev) => ({ ...prev, logo: 'Logo must be an image (JPEG, PNG, JPG, GIF)' }));
          return;
        }
        if (file.size > maxSize) {
          setEditErrors((prev) => ({ ...prev, logo: 'Logo size must be less than 2MB' }));
          return;
        }
      }
      setEditForm((prev) => ({ ...prev, logo: file || null }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
    setEditErrors((prev) => ({ ...prev, [name]: '' }));
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
      if (fileInputRef.current) fileInputRef.current.value = '';
      setErrors({});
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
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
      if (editFileInputRef.current) editFileInputRef.current.value = '';
      setEditErrors({});
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setEditErrors(errorData.errors);
      } else {
        setEditErrors({ general: errorData?.message || 'Failed to update brand' });
        showErrorAlert('Error', errorData?.message || 'Failed to update brand');
      }
    } finally {
      setIsLoadingForm(false);
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

  // Handle delete brand
  const handleDelete = async (brandId) => {
    const result = await showConfirmDialog(
      'Are you sure?',
      "You won't be able to revert this!",
      'Yes, delete it!'
    );
    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await apiService.delete(`/brands/${brandId}`);
        showSuccessAlert('Deleted!', 'Your brand has been deleted.');
        fetchBrands(pagination.currentPage, pagination.itemsPerPage, filters);
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to delete brand');
      } finally {
        setIsDeleting(false);
      }
    }
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
    setShowEditModal(true);
  };

  // Fetch data when refreshTrigger changes
  useEffect(() => {
    fetchBrands(pagination.currentPage, pagination.itemsPerPage, filters);
  }, [refreshTrigger, fetchBrands, pagination.currentPage, pagination.itemsPerPage, filters]);

  // Render error messages
  const renderError = (field, errorsObj) => {
    return errorsObj[field] ? (
      <p className="text-red-500 text-xs italic mt-1">{errorsObj[field]}</p>
    ) : null;
  };

  // Table columns for brands
  const brandColumns = useMemo(
    () => [
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
        key: 'logo',
        title: 'Logo',
        sortable: false,
        render: (value) =>
          value ? (
<img
      src={`http://localhost:5000/${value}`}
      alt="Category Image"
      className="w-12 h-12 object-contain"
    />          ) : (
            '--'
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
            <button
              onClick={() => openViewModal(item)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded"
              title="View Details"
              aria-label="View Brand Details"
            >
              <FiEye className="text-lg" />
            </button>
            <button
              onClick={() => openEditModal(item)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded"
              title="Edit Brand"
              aria-label="Edit Brand"
            >
              <FiEdit className="text-lg" />
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className={`text-red-600 hover:text-red-800 p-1 rounded ${
                isDeleting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              title="Delete Brand"
              aria-label="Delete Brand"
              disabled={isDeleting}
            >
              <FiTrash2 className="text-lg" />
            </button>
          </div>
        ),
      },
    ],
    [isDeleting]
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Brands Management</h1>

      {/* Add Brand Form */}
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Brand</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <p className="text-red-500 text-xs italic mb-4">{errors.general}</p>
          )}
          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="name"
            >
              Brand Name *
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
              placeholder="e.g. Nike"
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
              placeholder="e.g. Leading sportswear brand"
            />
            {renderError('description', errors)}
          </div>

          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="website"
            >
              Website
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.website ? 'border-red-500' : 'border-gray-200'
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="website"
              name="website"
              type="text"
              value={form.website}
              onChange={handleChange}
              placeholder="e.g. https://www.nike.com"
            />
            {renderError('website', errors)}
          </div>

          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="country"
            >
              Country
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.country ? 'border-red-500' : 'border-gray-200'
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="country"
              name="country"
              type="text"
              value={form.country}
              onChange={handleChange}
              placeholder="e.g. USA"
            />
            {renderError('country', errors)}
          </div>

          <div className="mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="logo"
            >
              Logo
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                errors.logo ? 'border-red-500' : 'border-gray-200'
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              id="logo"
              name="logo"
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              onChange={handleChange}
              ref={fileInputRef}
            />
            {renderError('logo', errors)}
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
                'Create Brand'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Brands List */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Brands List</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200"
          title="Refresh data"
          aria-label="Refresh brands list"
        >
          <FiRefreshCw className={`text-lg ${loadingTable ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Brands</div>
          <div className="text-2xl font-bold text-gray-900">{pagination.totalResults}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <CustomTable
          columns={brandColumns}
          data={brands}
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
          emptyMessage="No brands found."
        />
      </div>

      {/* View Modal */}
      {showViewModal && selectedBrand && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
          role="dialog"
          aria-labelledby="view-modal-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 id="view-modal-title" className="text-xl font-semibold mb-4">
              Brand Details
            </h2>
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
                <img       src={`http://localhost:5000/${selectedBrand.logo}`}
 alt="Brand Logo" className="w-24 h-24 object-contain" />
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
            <button
              onClick={() => setShowViewModal(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              autoFocus
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBrand && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
          role="dialog"
          aria-labelledby="edit-modal-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-8 max-w-md w-full overflow-y-auto max-h-96">
            <h2 id="edit-modal-title" className="text-xl font-semibold mb-4">
              Edit Brand
            </h2>
            <form onSubmit={handleEditSubmit}>
              {editErrors.general && (
                <p className="text-red-500 text-xs italic mb-4">{editErrors.general}</p>
              )}
              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="edit-name"
                >
                  Brand Name *
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
                  placeholder="e.g. Nike"
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
                  placeholder="e.g. Leading sportswear brand"
                />
                {renderError('description', editErrors)}
              </div>

              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="edit-website"
                >
                  Website
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    editErrors.website ? 'border-red-500' : 'border-gray-200'
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="edit-website"
                  name="website"
                  type="text"
                  value={editForm.website}
                  onChange={handleEditChange}
                  placeholder="e.g. https://www.nike.com"
                />
                {renderError('website', editErrors)}
              </div>

              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="edit-country"
                >
                  Country
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    editErrors.country ? 'border-red-500' : 'border-gray-200'
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="edit-country"
                  name="country"
                  type="text"
                  value={editForm.country}
                  onChange={handleEditChange}
                  placeholder="e.g. USA"
                />
                {renderError('country', editErrors)}
              </div>

              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="edit-logo"
                >
                  Logo
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    editErrors.logo ? 'border-red-500' : 'border-gray-200'
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="edit-logo"
                  name="logo"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={handleEditChange}
                  ref={editFileInputRef}
                />
                {selectedBrand.logo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Current Logo:</p>
        <img       src={`http://localhost:5000/${selectedBrand.logo}`}
 alt="Brand Logo" className="w-24 h-24 object-contain" />                  </div>
                )}
                {renderError('logo', editErrors)}
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
                    'Update Brand'
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

export default AddBrand;