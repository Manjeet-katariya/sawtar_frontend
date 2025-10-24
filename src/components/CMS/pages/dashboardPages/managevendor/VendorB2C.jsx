import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiRefreshCw, FiEye, FiCheck, FiX, FiChevronDown, FiChevronUp, FiShoppingBag } from 'react-icons/fi';
import CustomTable from '../../custom/CustomTable';
import { apiService } from '../../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../../manageApi/utils/toast';

const VendorB2C = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_results: 0,
    items_per_page: 10,
  });
  const [activeTab, setActiveTab] = useState('approved'); // 'approved', 'pending', or 'rejected'
  const [filters, setFilters] = useState({
    status: 1, // Default to approved
    search: '',
    store_type: '',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejection_reason, setRejectionReason] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // Fetch B2C vendors
  const fetchVendors = useCallback(
    async (page = 1, itemsPerPage = 10, filters = {}) => {
      setLoading(true);
      try {
        let status;
        if (activeTab === 'approved') status = 1;
        else if (activeTab === 'pending') status = 0;
        else if (activeTab === 'rejected') status = 2;

        const params = {
          page,
          limit: itemsPerPage,
          status,
          role: 'Vendor-B2C', // Filter for B2C vendors
        };

        if (filters.search) params.search = filters.search;
        if (filters.store_type) params.store_type = filters.store_type;

        const response = await apiService.get('/vendor/b2c', params);

        setVendors(response.vendors || []);
        setPagination({
          current_page: response.pagination?.page || 1,
          total_pages: response.pagination?.totalPages || Math.ceil(response.pagination?.total / response.pagination?.limit) || 1,
          total_results: response.pagination?.total || 0,
          items_per_page: response.pagination?.limit || 10,
        });
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to fetch B2C vendors', 'error');
        setVendors([]);
      } finally {
        setLoading(false);
      }
    },
    [activeTab]
  );

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let newStatus;
    if (tab === 'approved') newStatus = 1;
    else if (tab === 'pending') newStatus = 0;
    else if (tab === 'rejected') newStatus = 2;

    setFilters((prev) => ({ ...prev, status: newStatus }));
  };

  // Handle page change
  const handlePageChange = (page, itemsPerPage) => {
    fetchVendors(page, itemsPerPage, filters);
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    let status;
    if (activeTab === 'approved') status = 1;
    else if (activeTab === 'pending') status = 0;
    else if (activeTab === 'rejected') status = 2;

    const updatedFilters = { ...newFilters, status };
    setFilters(updatedFilters);
    fetchVendors(1, pagination.items_per_page, updatedFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchVendors(pagination.current_page, pagination.items_per_page, filters);
  }, [activeTab, refreshTrigger, fetchVendors]);

  // Open reject modal
  const openRejectModal = (vendor) => {
    setSelectedVendor(vendor);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedVendor(null);
    setRejectionReason('');
  };

  // Update vendor status
  const handleStatusUpdate = async (vendor_id, newStatus, reason = '') => {
    try {
      const data = { status: newStatus };
      if (reason) data.rejection_reason = reason;

      await apiService.put(`/vendor/b2c/${vendor_id}/status`, data);
      showToast(`B2C vendor status updated successfully`, 'success');
      fetchVendors(pagination.current_page, pagination.items_per_page, filters);
      closeRejectModal();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update vendor status', 'error');
    }
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (vendor_id, categoryIndex) => {
    setExpandedCategories(prev => {
      const key = `${vendor_id}-${categoryIndex}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  // Table columns for B2C vendors
  const vendorColumns = [
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      filterable: true,
      render: (value) => <span className="text-gray-900">{value || '--'}</span>,
    },
    {
      key: 'store_details.store_name',
      title: 'Store Name',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.store_details?.store_name || '--'}</div>
          {item.full_name && (
            <div className="text-xs text-gray-500">Owner: {item.full_name}</div>
          )}
        </div>
      ),
    },
    {
      key: 'store_details.store_type',
      title: 'Store Type',
      sortable: true,
      render: (value, item) => (
        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
          {item.store_details?.store_type || '--'}
        </span>
      ),
    },
    {
      key: 'mobile',
      title: 'Mobile',
      sortable: false,
      render: (value, item) => (
        <div>
          <div className="text-gray-900">{value || '--'}</div>
          {item.is_mobile_verified && (
            <span className="text-xs text-green-600">Verified</span>
          )}
        </div>
      ),
    },
    {
      key: 'registration.gstin',
      title: 'GSTIN',
      sortable: true,
      render: (value, item) => <span className="text-gray-900">{item.registration?.gstin || '--'}</span>,
    },
    {
      key: 'registration.pan_number',
      title: 'PAN Number',
      sortable: true,
      render: (value, item) => <span className="text-gray-900">{item.registration?.pan_number || '--'}</span>,
    },
    {
      key: 'store_details.categories',
      title: 'Categories & Subcategories',
      sortable: false,
      render: (value, item) => {
        const categories = item.store_details?.categories || [];
        
        if (categories.length === 0) {
          return '--';
        }
        
        return (
          <div className="space-y-2">
            {categories.map((category, index) => {
              const key = `${item._id}-${index}`;
              const isExpanded = expandedCategories[key];
              const sub_categories = category.sub_categories || [];
              
              return (
                <div key={key} className="border rounded-md p-2">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleCategoryExpansion(item._id, index)}
                  >
                    <span className="font-medium text-sm">{category.name}</span>
                    {sub_categories.length > 0 && (
                      isExpanded ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </div>
                  
                  {isExpanded && sub_categories.length > 0 && (
                    <div className="mt-2 pl-2 border-t pt-2">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Subcategories:</div>
                      <div className="flex flex-wrap gap-1">
                        {sub_categories.map((subcategory, subIndex) => (
                          <span
                            key={subIndex}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                          >
                            {subcategory}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'status_info.status',
      title: 'Status',
      sortable: true,
      render: (value, item) => {
        const statusConfig = {
          0: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
          1: { class: 'bg-green-100 text-green-800', text: 'Approved' },
          2: { class: 'bg-red-100 text-red-800', text: 'Rejected' },
        };

        const config = statusConfig[item.status_info.status] || statusConfig[0];

        return (
          <div>
            <span className={`px-2 py-1 text-xs font-medium rounded ${config.class}`}>
              {config.text}
            </span>
            {item.status_info.status === 2 && item.status_info?.rejection_reason && (
              <div className="text-xs text-gray-500 mt-1">
                Reason: {item.status_info.rejection_reason}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'meta.created_at',
      title: 'Registered At',
      sortable: true,
      render: (value, item) => (
        <span className="text-gray-900">
          {item.meta.created_at ? new Date(item.meta.created_at).toLocaleDateString('en-GB') : '--'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, item) => (
        <div className="flex space-x-2">
          <Link
            to={`/sawtar/cms/vendors/b2c/${item._id}`}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            title="View Details"
          >
            <FiEye className="text-lg" />
          </Link>
          {activeTab === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate(item._id, 1)}
                className="text-green-600 hover:text-green-800 p-1 rounded"
                title="Approve Vendor"
              >
                <FiCheck className="text-lg" />
              </button>
              <button
                onClick={() => openRejectModal(item)}
                className="text-red-600 hover:text-red-800 p-1 rounded"
                title="Reject Vendor"
              >
                <FiX className="text-lg" />
              </button>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'product_requests',
      title: 'Product Requests',
      sortable: false,
      render: (value, item) => (
        <Link
          to={`/sawtar/cms/vendor/b2c/product/request/${item._id}`}
          className="flex items-center text-purple-600 hover:text-purple-800 p-1 rounded"
          title="View Product Requests"
        >
          <FiShoppingBag className="text-lg mr-1" />
          View Requests
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">B2C Vendor Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200"
            title="Refresh data"
          >
            <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/sawtar/cms/vendor/b2c/request"
            className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-1 px-3 transition-colors duration-200"
          >
            <FiPlus className="text-lg" />
            B2C Vendor Requests
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange('approved')}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 ${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approved B2C Vendors
            </button>
            <button
              onClick={() => handleTabChange('pending')}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending B2C Requests
            </button>
            <button
              onClick={() => handleTabChange('rejected')}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 ${
                activeTab === 'rejected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rejected B2C Vendors
            </button>
          </nav>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total B2C Vendors</div>
          <div className="text-2xl font-bold text-gray-900">{pagination.total_results}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-green-600">
            {activeTab === 'approved' ? vendors.length : '-'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {activeTab === 'pending' ? vendors.length : '-'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Rejected</div>
          <div className="text-2xl font-bold text-red-600">
            {activeTab === 'rejected' ? vendors.length : '-'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <CustomTable
          columns={vendorColumns}
          data={vendors}
          totalItems={pagination.total_results}
          currentPage={pagination.current_page}
          itemsPerPage={pagination.items_per_page}
          onPageChange={handlePageChange}
          onFilter={handleFilter}
          loading={loading}
          filters={[
            {
              key: 'search',
              type: 'text',
              placeholder: 'Search by email or store name...',
            },
            {
              key: 'store_type',
              type: 'select',
              placeholder: 'All store types',
              options: [
                { value: '', label: 'All Types' },
                { value: 'Individual / Sole Proprietor', label: 'Individual / Sole Proprietor' },
                { value: 'Partnership', label: 'Partnership' },
                { value: 'Private Limited', label: 'Private Limited' },
              ],
            },
          ]}
          emptyMessage={
            activeTab === 'approved'
              ? 'No approved B2C vendors found.'
              : activeTab === 'pending'
              ? 'No pending B2C vendor requests.'
              : 'No rejected B2C vendors found.'
          }
        />
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Reject B2C Vendor</h2>
            <p className="mb-2">
              Vendor: {selectedVendor.store_details?.store_name || 'Unknown'}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                value={rejection_reason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedVendor._id, 2, rejection_reason)}
                disabled={!rejection_reason.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  !rejection_reason.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorB2C;