import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaBuilding, FaCheckCircle, FaTimesCircle, FaSyncAlt, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { apiService } from '../../../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../../../manageApi/utils/toast';

const Freelancers = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approved');
  const [filters, setFilters] = useState({
    search: '',
    availability: '',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [expandedServices, setExpandedServices] = useState({});

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // Fetch freelancers
  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      let status;
      if (activeTab === 'approved') status = 1;
      else if (activeTab === 'pending') status = 0;
      else if (activeTab === 'rejected') status = 2;
      else if (activeTab === 'suspended') status = 3;

      const params = {};
      if (status !== undefined) params.status = status;
      if (filters.search) params.search = filters.search;
      if (filters.availability) params.availability = filters.availability;

      const response = await apiService.get('/freelancer', params);
      setFreelancers(response.freelancers || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch freelancers', 'error');
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchFreelancers();
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchFreelancers();
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchFreelancers();
  }, [activeTab, refreshTrigger, fetchFreelancers]);

  // Open reject modal
  const openRejectModal = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedFreelancer(null);
    setRejectionReason('');
  };

  // Update freelancer status
  const handleStatusUpdate = async (freelancerId, newStatus, reason = '') => {
    try {
      const data = { status: newStatus };
      if (reason) data.rejection_reason = reason;

      await apiService.put(`/freelancer/${freelancerId}/status`, data);
      showToast(`Freelancer status updated successfully`, 'success');
      fetchFreelancers();
      closeRejectModal();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update freelancer status', 'error');
    }
  };

  // Toggle service expansion
  const toggleServiceExpansion = (freelancerId, serviceIndex) => {
    setExpandedServices((prev) => {
      const key = `${freelancerId}-${serviceIndex}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white text-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Freelancer Management</h1>
          <div className="flex items-center gap-6">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-3 bg-teal-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
              title="Refresh data"
            >
              <FaSyncAlt className={`text-base ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              to="/sawtar/cms/freelancer/request"
              className="flex items-center gap-3 bg-teal-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaBuilding className="text-base" />
              New Freelancer Request
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
        <nav className="flex border-b border-gray-200">
          {['approved', 'pending', 'rejected', 'suspended'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-5 px-8 text-center font-medium text-base ${
                activeTab === tab
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-all duration-300`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="mb-8 flex gap-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by email or full name..."
          value={filters.search}
          onChange={(e) => handleFilter({ ...filters, search: e.target.value })}
          className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-80 bg-white shadow-sm"
        />
        <select
          value={filters.availability}
          onChange={(e) => handleFilter({ ...filters, availability: e.target.value })}
          className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-64 bg-white shadow-sm"
        >
          <option value="">All Availabilities</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      {/* Freelancer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-gray-600 font-medium">Loading freelancers...</div>
        ) : freelancers.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 font-medium">
            {activeTab === 'approved'
              ? 'No approved freelancers found.'
              : activeTab === 'pending'
              ? 'No pending freelancer requests.'
              : activeTab === 'rejected'
              ? 'No rejected freelancers found.'
              : 'No suspended freelancers found.'}
          </div>
        ) : (
          freelancers.map((freelancer) => (
            <div
              key={freelancer._id}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {freelancer.full_name || '--'}
                  </h3>
                  <p className="text-sm text-gray-500">{freelancer.email || '--'}</p>
                </div>
                <span
                  className={`px-4 py-1 text-sm font-medium rounded-full ${
                    freelancer.status_info.status === 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : freelancer.status_info.status === 1
                      ? 'bg-teal-100 text-teal-700'
                      : freelancer.status_info.status === 2
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {freelancer.status_info.status === 0
                    ? 'Pending'
                    : freelancer.status_info.status === 1
                    ? 'Approved'
                    : freelancer.status_info.status === 2
                    ? 'Rejected'
                    : 'Suspended'}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-3 flex items-center">
                <span className="font-semibold mr-2">Mobile:</span> {freelancer.mobile || '--'}
                {freelancer.is_mobile_verified && (
                  <span className="ml-2 text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full">Verified</span>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Location:</span>{' '}
                {`${freelancer.location?.city || ''}, ${freelancer.location?.state || ''}, ${freelancer.location?.country || ''}`.trim() || '--'}
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Availability:</span>{' '}
                <span className="px-3 py-1 text-xs rounded-full bg-teal-100 text-teal-700">
                  {freelancer.availability || '--'}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Languages:</span>{' '}
                <div className="flex flex-wrap gap-2 mt-2">
                  {(freelancer.languages || []).map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {lang}
                    </span>
                  ))}
                  {(!freelancer.languages || freelancer.languages.length === 0) && '--'}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Services Offered:</span>
                <div className="space-y-3 mt-2">
                  {(freelancer.servicesOffered || []).map((service, index) => {
                    const key = `${freelancer._id}-${index}`;
                    const isExpanded = expandedServices[key];
                    return (
                      <div key={key} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleServiceExpansion(freelancer._id, index)}
                        >
                          <span className="font-medium text-base text-gray-900">
                            {service.title}
                          </span>
                          {service.priceRange && (
                            isExpanded ? (
                              <FaChevronUp className="text-teal-600 text-lg" />
                            ) : (
                              <FaChevronDown className="text-teal-600 text-lg" />
                            )
                          )}
                        </div>
                        {isExpanded && service.priceRange && (
                          <div className="mt-3 pl-2 border-t border-gray-200 pt-3">
                            <div className="text-xs font-semibold text-gray-500 mb-2">
                              Price Range:
                            </div>
                            <span className="px-3 py-1 text-xs rounded-full bg-teal-100 text-teal-700">
                              {service.priceRange}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(!freelancer.servicesOffered || freelancer.servicesOffered.length === 0) && (
                    <span className="text-sm text-gray-500">--</span>
                  )}
                </div>
              </div>

              {freelancer.status_info.status === 2 && freelancer.status_info?.rejection_reason && (
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Rejection Reason:</span>{' '}
                  {freelancer.status_info.rejection_reason}
                </div>
              )}

              <div className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Registered At:</span>{' '}
                {freelancer.meta?.created_at
                  ? new Date(freelancer.meta.created_at).toLocaleDateString('en-GB')
                  : '--'}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Link
                  to={`/sawtar/cms/freelancer/${freelancer._id}`}
                  className="text-teal-600 hover:text-teal-800 p-3 rounded-full hover:bg-teal-100 transition-all duration-300"
                  title="View Details"
                >
                  <FaEye className="text-xl" />
                </Link>
                {activeTab === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(freelancer._id, 1)}
                      className="text-teal-600 hover:text-teal-800 p-3 rounded-full hover:bg-teal-100 transition-all duration-300"
                      title="Approve Freelancer"
                    >
                      <FaCheckCircle className="text-xl" />
                    </button>
                    <button
                      onClick={() => openRejectModal(freelancer)}
                      className="text-red-600 hover:text-red-800 p-3 rounded-full hover:bg-red-100 transition-all duration-300"
                      title="Reject Freelancer"
                    >
                      <FaTimesCircle className="text-xl" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedFreelancer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 ease-out scale-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Reject Freelancer</h2>
            <p className="mb-4 text-gray-600 text-base">
              Freelancer: {selectedFreelancer.full_name || 'Unknown'}
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                rows="5"
                placeholder="Provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeRejectModal}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedFreelancer._id, 2, rejectionReason)}
                disabled={!rejectionReason.trim()}
                className={`px-6 py-3 rounded-lg text-white ${
                  !rejectionReason.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 transition-all duration-300'
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

export default Freelancers;