import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiRefreshCw, FiEye, FiShoppingBag, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button, Spin, Tag, Empty } from 'antd';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import CustomTable from '../../../CMS/pages/custom/CustomTable';
import { useDeepCompareEffect } from 'react-use'; // For deep comparison of objects

const ManageProducts = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_results: 0,
    items_per_page: 10,
  });
  
  const ROUTES = {
  SELLER_ADD_PRODUCT: '/sawtar/cms/seller/b2c/addproducts',
  SELLER_PRODUCT_REVIEW: '/sawtar/cms/seller/b2c/product/review',
  SELLER_PRODUCT_INVENTORY: '/sawtar/cms/seller/b2c/product/inventory',
};
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    verification_status: '',
    search: '',
    category_id: '',
    date_filter: '',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await apiService.get('/categories');
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showToast('Failed to fetch categories. Please try again.', 'error');
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const [totalRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
        apiService.get('/products', { vendor_id: user.id, limit: 1 }),
        apiService.get('/products', { vendor_id: user.id, verification_status: 'pending', limit: 1 }),
        apiService.get('/products', { vendor_id: user.id, verification_status: 'approved', limit: 1 }),
        apiService.get('/products', { vendor_id: user.id, verification_status: 'rejected', limit: 1 }),
      ]);
      setStats({
        total: totalRes.pagination?.total || 0,
        pending: pendingRes.pagination?.total || 0,
        approved: approvedRes.pagination?.total || 0,
        rejected: rejectedRes.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      showToast('Failed to fetch stats. Please try again.', 'error');
    }
  };

  // Fetch products
  const fetchProducts = useCallback(
    async (page = 1, itemsPerPage = 10, filters = {}) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: itemsPerPage,
          vendor_id: user.id,
          verification_status: filters.verification_status || undefined,
          search: filters.search || undefined,
          category_id: filters.category_id || undefined,
          date_filter: filters.date_filter || undefined,
        };

        const response = await apiService.get('/products', params);
        setProducts(response.products || []);
        setPagination({
          current_page: response.pagination?.page || 1,
          total_pages: Math.ceil((response.pagination?.total || 0) / (response.pagination?.limit || 10)),
          total_results: response.pagination?.total || 0,
          items_per_page: response.pagination?.limit || 10,
        });
      } catch (error) {
        console.error('Failed to fetch products:', error);
        showToast(error.response?.data?.message || 'Failed to fetch products', 'error');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [user.id]
  );

  // Fetch data
  useDeepCompareEffect(() => {
    if (user.id) {
      fetchCategories();
      fetchStats();
      fetchProducts(pagination.current_page, pagination.items_per_page, filters);
    }
  }, [user.id, refreshTrigger, fetchProducts, pagination.current_page, pagination.items_per_page, filters]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters((prev) => ({
      ...prev,
      verification_status: tab === 'all' ? '' : tab,
    }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page, itemsPerPage) => {
    setPagination((prev) => ({ ...prev, current_page: page, items_per_page: itemsPerPage }));
    fetchProducts(page, itemsPerPage, filters);
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchProducts(1, pagination.items_per_page, updatedFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle row expansion
  const onExpand = (expanded, record) => {
    setExpandedRowKeys((prev) => (expanded ? [...prev, record._id] : prev.filter((id) => id !== record._id)));
  };

  // Expanded row render
  const expandedRowRender = (item) => {
    return (
      <div className="p-4 bg-gray-50">
        <h4 className="font-bold">Pricing Details</h4>
        <p>Cost Price: {item.pricing?.cost_price || 'N/A'}</p>
        <p>MRP: {item.pricing?.mrp || 'N/A'}</p>
        <p>Sale Price: {item.pricing?.sale_price || item.pricing?.base_price || 'N/A'}</p>
        <p>Currency: {item.pricing?.currency?.symbol || item.pricing?.currency?.code || 'N/A'}</p>
        <p>
          Discount:{' '}
          {item.pricing?.discount?.value
            ? `${item.pricing.discount.type === 'percentage' ? `${item.pricing.discount.value}%` : `${item.pricing.currency?.symbol || '₹'} ${item.pricing.discount.value}`} (Valid till ${new Date(item.pricing.discount.valid_till || Date.now()).toLocaleDateString('en-GB')})`
            : 'None'}
        </p>
        <p>
          Tax: {item.pricing?.tax?.rate || 0}% {item.pricing?.tax?.type || 'N/A'} (
          {item.pricing?.tax?.inclusive ? 'Inclusive' : 'Exclusive'})
        </p>

        <h4 className="font-bold mt-4">Shipping</h4>
        <p>Weight: {item.shipping?.weight || 'N/A'}</p>
        <p>
          Dimensions:{' '}
          {item.shipping?.dimensions
            ? `${item.shipping.dimensions.length} x ${item.shipping.dimensions.width} x ${item.shipping.dimensions.height}`
            : 'N/A'}
        </p>
        <p>Free Shipping: {item.shipping?.free_shipping ? 'Yes' : 'No'}</p>

        <h4 className="font-bold mt-4">SEO</h4>
        <p>Meta Title: {item.seo?.meta_title || 'N/A'}</p>
        <p>Meta Description: {item.seo?.meta_description || 'N/A'}</p>
        <p>Keywords: {item.seo?.keywords?.join(', ') || 'N/A'}</p>

        <h4 className="font-bold mt-4">Inventory</h4>
        {item.inventory?.length ? (
          <ul>
            {item.inventory.map((inv, idx) => (
              <li key={idx}>
                SKU: {inv.sku}, Quantity: {inv.quantity}, Warehouse: {inv.warehouse || 'N/A'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No inventory</p>
        )}

        <h4 className="font-bold mt-4">Documents</h4>
        {Object.entries(item.documents || {}).map(([key, doc]) =>
          doc ? (
            <p key={key}>
              {key.replace('_', ' ')}: {doc.path} (Verified: {doc.verified ? 'Yes' : 'No'})
            </p>
          ) : null
        ) || <p>No documents</p>}

        <h4 className="font-bold mt-4">Images</h4>
        {item.color_variants?.flatMap((variant) => variant.images || []).map((img, idx) => (
          <p key={idx}>
            Position {img.position}: {img.url} (Alt: {img.alt_text || 'N/A'})
          </p>
        )) || <p>No images</p>}

        <h4 className="font-bold mt-4">3D Model</h4>
        {item.three_d_model ? (
          <p>
            {item.three_d_model.url} (Format: {item.three_d_model.format}, Alt:{' '}
            {item.three_d_model.alt_text || 'N/A'})
          </p>
        ) : (
          <p>No 3D model</p>
        )}
      </div>
    );
  };

  // Table columns
  const productColumns = [
    {
      key: 'name',
      title: 'Product Name',
      sortable: true,
      render: (value) => <span className="text-gray-900 font-medium">{value || '--'}</span>,
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      render: (value, item) => (
        <span className="text-gray-900">{item.category?.name || '--'}</span>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      render: (value, item) => (
        <span className="text-gray-900 font-medium">
          {`${item.pricing?.currency?.symbol || '₹'} ${
            (item.pricing?.sale_price || item.pricing?.base_price || 0).toFixed(2)
          }`}
        </span>
      ),
    },
    {
      key: 'discount',
      title: 'Discount',
      sortable: false,
      render: (value, item) => (
        <span className="text-gray-900">
          {item.pricing?.discount?.value
            ? `${item.pricing.discount.type === 'percentage' ? `${item.pricing.discount.value}%` : `${item.pricing.currency?.symbol || '₹'} ${item.pricing.discount.value}`} (Valid till ${new Date(item.pricing.discount.valid_till || Date.now()).toLocaleDateString('en-GB')})`
            : '--'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value, item) => {
        const statusConfig = {
          pending: { class: 'bg-amber-100 text-amber-800', text: 'Pending' },
          approved: { class: 'bg-emerald-100 text-emerald-800', text: 'Approved' },
          rejected: { class: 'bg-rose-100 text-rose-800', text: 'Rejected' },
        };

        const config = statusConfig[item.verification_status?.status] || statusConfig.pending;

        return (
          <div>
            <Tag className={`px-3 py-1 text-sm font-medium rounded-full ${config.class}`}>
              {config.text}
            </Tag>
            {item.verification_status?.status === 'rejected' &&
              item.verification_status?.rejection_reason && (
                <div className="text-sm text-gray-500 mt-1">
                  Reason: {item.verification_status.rejection_reason}
                </div>
              )}
          </div>
        );
      },
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
        <div className="flex space-x-3">
          <Link
            to={`${ROUTES.SELLER_PRODUCT_REVIEW}/${item._id}`}
            className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100"
            title="View Details"
          >
            <FiEye className="text-lg" />
          </Link>
          {item.verification_status?.status === 'approved' && (
            <Link
              to={`${ROUTES.SELLER_PRODUCT_INVENTORY}/${item._id}`}
              className="text-purple-600 hover:text-purple-800 p-2 rounded-full hover:bg-purple-100"
              title="Manage Inventory"
            >
              <FiShoppingBag className="text-lg" />
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Product Requests</h1>
          <div className="flex items-center gap-4">
            <Button
              icon={<FiRefreshCw className={loading ? 'animate-spin' : ''} />}
              onClick={handleRefresh}
              className="text-blue-600 hover:text-blue-800"
            >
              Refresh
            </Button>
            <Link
              to={ROUTES.SELLER_ADD_PRODUCT}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              <FiPlus className="text-lg" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <nav className="flex border-b border-gray-200">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <Button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-4 px-6 text-center font-semibold text-sm ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
              </Button>
            ))}
          </nav>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Products', value: stats.total, color: 'text-gray-900' },
            { label: 'Pending', value: stats.pending, color: 'text-orange-600' },
            { label: 'Approved', value: stats.approved, color: 'text-green-600' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div>
          <CustomTable
            columns={productColumns}
            data={products}
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
                placeholder: 'Search by name or description...',
                className: 'bg-gray-100 text-gray-800 placeholder-gray-400 border-none focus:ring-indigo-600',
              },
              {
                key: 'category_id',
                type: 'select',
                placeholder: categoriesLoading ? 'Loading Categories...' : 'All Categories',
                options: [
                  { value: '', label: 'All Categories' },
                  ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
                ],
                disabled: categoriesLoading,
                className: 'bg-gray-100 text-gray-800 border-none focus:ring-indigo-600',
              },
              {
                key: 'date_filter',
                type: 'select',
                placeholder: 'All Dates',
                options: [
                  { value: '', label: 'All Dates' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'Last Week' },
                  { value: 'month', label: 'Last Month' },
                  { value: 'new', label: 'Last 24 Hours' },
                ],
                className: 'bg-gray-100 text-gray-800 border-none focus:ring-indigo-600',
              },
            ]}
            expandedRowRender={expandedRowRender}
            expandedRowKeys={expandedRowKeys}
            onExpand={onExpand}
            locale={{
              emptyText: <Empty description="No products found" />,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;