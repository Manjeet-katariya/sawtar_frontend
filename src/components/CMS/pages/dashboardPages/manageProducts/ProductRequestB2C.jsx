import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FiPlus, FiRefreshCw, FiEye, FiCheck, FiX, FiShoppingBag, FiClock, FiPackage, FiTrendingDown, FiImage, FiFileText } from 'react-icons/fi';
import { Button, Modal, Input, Tabs, Card, Tag, Select as AntdSelect, Statistic, DatePicker, Form, Collapse, Alert } from 'antd';
import CustomTable from '../../custom/CustomTable'; // Adjust the path as needed
import { apiService } from '../../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../../manageApi/utils/toast';
import { format, isBefore } from 'date-fns'; // Replaced moment with date-fns, corrected isBefore for disabledDate

const { Option } = AntdSelect;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const STATUS_MAP = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const ProductRequestB2C = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { id: vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    verification_status: 'pending',
    search: '',
    category_id: '',
    date_filter: '',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionSuggestion, setRejectionSuggestion] = useState('');
  const [assetErrors, setAssetErrors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [form] = Form.useForm();

  // Validate vendorId
  const isValidVendorId = vendorId && vendorId !== 'undefined' && vendorId !== 'null';

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/categories');
      setCategories(response.categories || []);
    } catch (error) {
      showToast('Failed to fetch categories', 'error');
    }
  };

  // Fetch taxes for tax dropdown
  const fetchTaxes = async () => {
    try {
      const response = await apiService.get('/setting/tax');
      setTaxes(response.taxes || []);
    } catch (error) {
      showToast('Failed to fetch taxes', 'error');
    }
  };

  // Fetch products using vendor_id from URL params
  const fetchProducts = useCallback(
    async (page = 1, itemsPerPage = 10, filters = {}) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: itemsPerPage,
          verification_status: filters.verification_status,
          vendor_id: isValidVendorId
            ? vendorId
            : user.role === 'Vendor-B2C' && !user.is_superadmin
            ? user.id
            : undefined,
        };

        if (filters.search) params.search = filters.search;
        if (filters.category_id) params.category_id = filters.category_id;
        if (filters.date_filter) params.date_filter = filters.date_filter;

        const response = await apiService.get('/products', params);

        const rawProducts = response.products || [];
        setProducts(rawProducts.map((p, index) => ({ ...p, key: p._id })));
        setPagination({
          currentPage: response.pagination?.page || 1,
          totalPages: Math.ceil((response.pagination?.total || 0) / (response.pagination?.limit || 10)) || 1,
          totalResults: response.pagination?.total || 0,
          itemsPerPage: response.pagination?.limit || 10,
        });
        setStats({
          total: response.stats?.total || 0,
          pending: response.stats?.pending || response.stats?.today || 0,
          approved: response.stats?.approved || response.stats?.month || 0,
          rejected: response.stats?.rejected || response.stats?.week || 0,
        });
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to fetch products', 'error');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [user, isValidVendorId, vendorId]
  );

  // Fetch data when dependencies change
  useEffect(() => {
    fetchCategories();
    fetchTaxes();
    fetchProducts(pagination.currentPage, pagination.itemsPerPage, filters);
  }, [activeTab, refreshTrigger, fetchProducts]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters((prev) => ({
      ...prev,
      verification_status: tab,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (page, itemsPerPage) => {
    setPagination((prev) => ({ ...prev, currentPage: page, itemsPerPage: itemsPerPage || prev.itemsPerPage }));
    fetchProducts(page, itemsPerPage || pagination.itemsPerPage, filters);
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    const updatedFilters = { ...newFilters, verification_status: filters.verification_status };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProducts(1, pagination.itemsPerPage, updatedFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Open reject modal
  const openRejectModal = (product) => {
    setSelectedProduct(product);
    setRejectionReason('');
    setRejectionSuggestion('');
    setAssetErrors([]); // Clear asset errors
    setShowRejectModal(true);
  };

  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedProduct(null);
    setRejectionReason('');
    setRejectionSuggestion('');
    setAssetErrors([]); // Clear asset errors
  };

  // Open pricing modal (renamed from discount modal)
  const openPricingModal = (product) => {
    setSelectedProduct(product);
    form.setFieldsValue({
      discount_type: product.pricing?.discount?.type || 'percentage',
      discount_value: product.pricing?.discount?.value || 0,
      valid_till: product.pricing?.discount?.valid_till
        ? new Date(product.pricing.discount.valid_till)
        : null,
      sale_price: product.pricing?.sale_price || product.pricing?.base_price || 0,
      tax_id: product.pricing?.tax?.tax_id || '',
      rate: product.pricing?.tax?.rate || 0,
    });
    setShowPricingModal(true);
  };

  // Close pricing modal
  const closePricingModal = () => {
    setShowPricingModal(false);
    setSelectedProduct(null);
    form.resetFields();
  };

  // Update product and asset verification
  const handleStatusUpdate = async (product_id, newStatus, reason = '', suggestion = '') => {
    try {
      const data = { status: newStatus };
      if (newStatus === 'rejected') {
        data.rejection_reason = reason;
        data.suggestion = suggestion;
      }

      const response = await apiService.put(`/products/${product_id}/verify-all`, data);
      showToast(response.message || `Product and assets ${newStatus} successfully`, 'success');
      fetchProducts(pagination.currentPage, pagination.itemsPerPage, filters);
      closeRejectModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product and assets';
      showToast(errorMessage, 'error');
      if (error.response?.data?.assetErrors) {
        setAssetErrors(error.response.data.assetErrors);
      }
    }
  };

  // Handle tax selection change to auto-populate rate
  const handleTaxChange = (value) => {
    const selectedTax = taxes.find((t) => t._id === value);
    if (selectedTax) {
      form.setFieldsValue({ rate: selectedTax.rate });
    }
  };

  // Update product pricing (sale_price, discount, tax) using the new endpoint
  const handlePricingUpdate = async (values) => {
    try {
      const { discount_type, discount_value, valid_till, sale_price, tax_id, rate } = values;
      const product_id = selectedProduct._id;

      const payload = {
        sale_price,
        discount: {
          type: discount_type,
          value: discount_value,
          valid_till: valid_till ? valid_till.toISOString() : undefined,
        },
        tax: {
          tax_id: tax_id || undefined,
          rate,
        },
      };

      await apiService.put(`/products/${product_id}/pricing`, payload);

      showToast('Pricing updated successfully', 'success');
      fetchProducts(pagination.currentPage, pagination.itemsPerPage, filters);
      closePricingModal();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update pricing', 'error');
    }
  };

  // Toggle active/inactive status via Select
  const handleActiveStatusChange = async (product_id, newStatus) => {
    try {
      await apiService.put(`/products/${product_id}`, { status: newStatus });
      showToast(`Product active status updated to ${newStatus}`, 'success');
      setProducts((prev) =>
        prev.map((item) => (item._id === product_id ? { ...item, status: newStatus } : item))
      );
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update active status', 'error');
      fetchProducts(pagination.currentPage, pagination.itemsPerPage, filters);
    }
  };

  // Add SNO to data
  const dataWithSno = useMemo(() => {
    return products.map((item, index) => ({
      ...item,
      sno: (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1,
    }));
  }, [products, pagination.currentPage, pagination.itemsPerPage]);

  // Table columns for products (added tax rate column)
  const productColumns = [
    {
      key: 'sno',
      title: 'S.No',
      render: (value, item) => <div className="font-medium text-gray-900">{item.sno}</div>,
    },
    {
      key: 'name',
      title: 'Product Name',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name || '--'}</div>
          <div className="text-sm text-gray-500">{item.product_code || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'vendor',
      title: 'Vendor',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.vendor?.full_name || '--'}</div>
          <div className="text-sm text-gray-500">{item.vendor?.email || '--'}</div>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      render: (value, item) => <div className="text-gray-900">{item.category?.name || '--'}</div>,
    },
    {
      key: 'pricing.sale_price',
      title: 'Sale Price',
      render: (value, item) => (
        <div className="font-medium text-gray-900">
          {item.pricing?.sale_price > 0
            ? `${item.pricing.currency.symbol} ${item.pricing.sale_price.toFixed(2)}`
            : item.pricing?.final_price
            ? `${item.pricing.currency.symbol} ${item.pricing.final_price.toFixed(2)}`
            : '--'}
        </div>
      ),
    },
    {
      key: 'pricing.discount',
      title: 'Discount',
      render: (value, item) => (
        <div className="text-gray-900">
          {item.pricing?.discount?.value > 0 && item.pricing?.discount?.approved
            ? `${
                item.pricing.discount.type === 'percentage'
                  ? `${item.pricing.discount.value}%`
                  : `${item.pricing.currency.symbol} ${item.pricing.discount.value}`
              } (Valid till ${
                item.pricing.discount.valid_till
                  ? format(new Date(item.pricing.discount.valid_till), 'dd/MM/yyyy')
                  : '--'
              })`
            : '--'}
        </div>
      ),
    },
    {
      key: 'pricing.tax.rate',
      title: 'Tax Rate',
      render: (value, item) => (
        <div className="text-gray-900">
          {item.pricing?.tax?.rate ? `${item.pricing.tax.rate}%` : '--'}
        </div>
      ),
    },
    {
      key: 'verification_status.status',
      title: 'Verification Status',
      render: (value, item) => {
        const statusConfig = {
          pending: { color: 'warning', text: 'Pending' },
          approved: { color: 'success', text: 'Approved' },
          rejected: { color: 'error', text: 'Rejected' },
        };

        const config = statusConfig[item.verification_status?.status] || statusConfig.pending;

        return (
          <div>
            <Tag color={config.color}>{config.text}</Tag>
            {item.verification_status?.status === 'rejected' && item.verification_status?.rejection_reason && (
              <div className="text-sm text-gray-500 mt-1">
                Reason: {item.verification_status.rejection_reason}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      title: 'Active Status',
      render: (value, item) => (
        <AntdSelect
          value={item.status}
          onChange={(newValue) => handleActiveStatusChange(item._id, newValue)}
          style={{ width: 120 }}
          className={item.status === STATUS_MAP.ACTIVE ? 'text-green-700' : 'text-red-700'}
        >
          <Option value={STATUS_MAP.ACTIVE} className="text-green-700">
            Active
          </Option>
          <Option value={STATUS_MAP.INACTIVE} className="text-red-700">
            Inactive
          </Option>
        </AntdSelect>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      render: (value, item) => (
        <div className="text-gray-900">
          {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy') : '--'}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, item) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<FiEye />}
            href={`/sawtar/cms/vendor/b2c/product/review/${item._id}`}
            title="View Details"
          />
          {activeTab === 'pending' && (
            <>
              <Button
                type="link"
                icon={<FiCheck />}
                onClick={() => handleStatusUpdate(item._id, 'approved')}
                title="Approve Product and Assets"
                className="text-green-600"
              />
              <Button
                type="link"
                icon={<FiX />}
                onClick={() => openRejectModal(item)}
                title="Reject Product and Assets"
                danger
              />
            </>
          )}
          <Button
            type="link"
            icon={<FiShoppingBag />}
            href={`/sawtar/cms/products/inventory/${item._id}`}
            title="Manage Inventory"
            className="text-purple-600"
          />
          <Button
            type="link"
            icon={<FiTrendingDown />}
            onClick={() => openPricingModal(item)}
            title="Update Pricing"
            className="text-blue-600"
          />
        </div>
      ),
    },
  ];

  // Expandable row for asset verification details
  const expandedRowRender = (item) => {
    const documentFields = ['product_invoice', 'product_certificate', 'quality_report'];
    const documents = documentFields
      .filter((field) => item.documents[field])
      .map((field) => ({
        type: field,
        ...item.documents[field],
      }));
    const images = item.color_variants.flatMap((variant) =>
      variant.images.map((img) => ({
        type: `Image (${variant.color_name})`,
        ...img,
      }))
    );

    return (
      <Collapse>
        <Panel header="Asset Verification Details" key="assets">
          {documents.map((doc) => (
            <div key={doc._id} className="mb-2">
              <div className="flex items-center">
                <FiFileText className="mr-2" />
                <span>{doc.type}: </span>
                <Tag color={doc.verified ? 'green' : 'red'} className="ml-2">
                  {doc.verified ? 'Verified' : 'Not Verified'}
                </Tag>
              </div>
              {!doc.verified && doc.reason && (
                <div className="text-sm text-gray-500 ml-6">
                  Reason: {doc.reason}
                  {doc.suggestion && <div>Suggestion: {doc.suggestion}</div>}
                </div>
              )}
            </div>
          ))}
          {images.map((img) => (
            <div key={img._id} className="mb-2">
              <div className="flex items-center">
                <FiImage className="mr-2" />
                <span>{img.type}: {img.alt_text}</span>
                <Tag color={img.verified ? 'green' : 'red'} className="ml-2">
                  {img.verified ? 'Verified' : 'Not Verified'}
                </Tag>
              </div>
              {!img.verified && img.reason && (
                <div className="text-sm text-gray-500 ml-6">
                  Reason: {img.reason}
                  {img.suggestion && <div>Suggestion: {img.suggestion}</div>}
                </div>
              )}
            </div>
          ))}
          {item.three_d_model && (
            <div className="mb-2">
              <div className="flex items-center">
                <FiFileText className="mr-2" />
                <span>3D Model</span>
                <Tag color={item.three_d_model.verified ? 'green' : 'red'} className="ml-2">
                  {item.three_d_model.verified ? 'Verified' : 'Not Verified'}
                </Tag>
              </div>
              {!item.three_d_model.verified && item.three_d_model.reason && (
                <div className="text-sm text-gray-500 ml-6">
                  Reason: {item.three_d_model.reason}
                  {item.three_d_model.suggestion && <div>Suggestion: {item.three_d_model.suggestion}</div>}
                </div>
              )}
            </div>
          )}
        </Panel>
      </Collapse>
    );
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto">
        <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px 24px' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">B2C Product Requests</h1>
              <p className="text-gray-500 mt-1">Manage and review product requests</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleRefresh}
                icon={<FiRefreshCw className={loading ? 'animate-spin' : ''} />}
                loading={loading}
                className="flex items-center gap-2"
              >
                Refresh
              </Button>
              <Button type="primary" icon={<FiPlus />} href="/sawtar/cms/products/add" className="flex items-center gap-2">
                Add Product
              </Button>
            </div>
          </div>
        </Card>

        <Tabs activeKey={activeTab} onChange={handleTabChange} className="mb-6">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <TabPane tab={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Requests`} key={tab} />
          ))}
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-md border-0 rounded-xl">
            <Statistic
              title="Total Products"
              value={stats.total}
              prefix={<FiPackage className="text-blue-600" />}
              valueStyle={{ color: '#3f51b5', fontWeight: 500 }}
            />
          </Card>
          <Card className="shadow-md border-0 rounded-xl">
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<FiClock className="text-yellow-600" />}
              valueStyle={{ color: '#ff9800', fontWeight: 500 }}
            />
          </Card>
          <Card className="shadow-md border-0 rounded-xl">
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={<FiCheck className="text-green-600" />}
              valueStyle={{ color: '#4caf50', fontWeight: 500 }}
            />
          </Card>
          <Card className="shadow-md border-0 rounded-xl">
            <Statistic
              title="Rejected"
              value={stats.rejected}
              prefix={<FiX className="text-red-600" />}
              valueStyle={{ color: '#f44336', fontWeight: 500 }}
            />
          </Card>
        </div>

        <CustomTable
          columns={productColumns}
          data={dataWithSno}
          totalItems={pagination.totalResults}
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onFilter={handleFilter}
          loading={loading}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.documents || record.color_variants.length > 0 || record.three_d_model,
          }}
          filters={[
            {
              key: 'search',
              type: 'text',
              placeholder: 'Search by name or description...',
            },
            {
              key: 'category_id',
              type: 'select',
              placeholder: 'All Categories',
              options: [{ value: '', label: 'All Categories' }, ...categories.map((cat) => ({ value: cat._id, label: cat.name }))],
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
            },
          ]}
          emptyMessage={
            activeTab === 'pending'
              ? 'No pending product requests found.'
              : activeTab === 'approved'
              ? 'No approved products found.'
              : 'No rejected products found.'
          }
        />

        {assetErrors.length > 0 && (
          <div className="mt-4">
            {assetErrors.map((error, index) => (
              <Alert
                key={index}
                message={`Asset Error: ${error.assetId}`}
                description={error.message}
                type="error"
                showIcon
                className="mb-2"
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={showRejectModal}
        onCancel={closeRejectModal}
        title="Reject Product and Assets"
        footer={[
          <Button key="cancel" onClick={closeRejectModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={() => handleStatusUpdate(selectedProduct._id, 'rejected', rejectionReason, rejectionSuggestion)}
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>,
        ]}
        centered
      >
        <p className="text-gray-600 mb-4">
          Product: <span className="font-medium">{selectedProduct?.name}</span>
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Reason for Rejection</label>
          <TextArea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            placeholder="Provide a reason for rejection..."
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Suggestion (Optional)</label>
          <TextArea
            value={rejectionSuggestion}
            onChange={(e) => setRejectionSuggestion(e.target.value)}
            rows={4}
            placeholder="Provide a suggestion for improvement..."
          />
        </div>
      </Modal>

      <Modal
        open={showPricingModal}
        onCancel={closePricingModal}
        title="Update Pricing"
        footer={[
          <Button key="cancel" onClick={closePricingModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" form="pricingForm" htmlType="submit">
            Update
          </Button>,
        ]}
        centered
      >
        <p className="text-gray-600 mb-4">
          Product: <span className="font-medium">{selectedProduct?.name}</span>
        </p>
        <Form
          form={form}
          id="pricingForm"
          onFinish={handlePricingUpdate}
          layout="vertical"
          initialValues={{
            discount_type: 'percentage',
            discount_value: 0,
            valid_till: null,
            sale_price: selectedProduct?.pricing?.sale_price || selectedProduct?.pricing?.base_price || 0,
            tax_id: '',
            rate: 0,
          }}
        >
          <Form.Item
            label="Discount Type"
            name="discount_type"
            rules={[{ required: true, message: 'Please select a discount type' }]}
          >
            <AntdSelect>
              <Option value="percentage">Percentage</Option>
              <Option value="fixed">Fixed Amount</Option>
            </AntdSelect>
          </Form.Item>
          <Form.Item
            label="Discount Value"
            name="discount_value"
            rules={[
              { required: true, message: 'Please enter a discount value' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value < 0) {
                    return Promise.reject(new Error('Discount value must be non-negative'));
                  }
                  if (getFieldValue('discount_type') === 'percentage' && value > 100) {
                    return Promise.reject(new Error('Percentage discount must be between 0 and 100'));
                  }
                  if (
                    getFieldValue('discount_type') === 'fixed' &&
                    value > (selectedProduct?.pricing?.base_price || 0)
                  ) {
                    return Promise.reject(new Error('Fixed discount cannot exceed base price'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="number" min={0} placeholder="Enter discount value" />
          </Form.Item>
          <Form.Item
            label="Valid Till"
            name="valid_till"
            rules={[{ required: true, message: 'Please select a valid till date' }]}
          >
            <DatePicker
              format="yyyy-MM-dd"
              disabledDate={(current) => current && isBefore(new Date(current), new Date())}
            />
          </Form.Item>
          <Form.Item
            label="Sale Price"
            name="sale_price"
            rules={[
              { required: true, message: 'Please enter a sale price' },
              {
                validator(_, value) {
                  if (!value || value < 0) {
                    return Promise.reject(new Error('Sale price must be non-negative'));
                  }
                  if (value > (selectedProduct?.pricing?.base_price || 0)) {
                    return Promise.reject(new Error('Sale price cannot exceed base price'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              placeholder="Enter sale price"
              addonBefore={selectedProduct?.pricing?.currency?.symbol || '₹'}
            />
          </Form.Item>
          <Form.Item
            label="Tax"
            name="tax_id"
          >
            <AntdSelect
              placeholder="Select a tax (optional)"
              allowClear
              onChange={handleTaxChange}
            >
              {taxes.map((tax) => (
                <Option key={tax._id} value={tax._id}>
                  {tax.taxName} ({tax.rate}%)
                </Option>
              ))}
            </AntdSelect>
          </Form.Item>
          <Form.Item
            label="Tax Rate (%)"
            name="rate"
            rules={[
              { required: true, message: 'Please enter a tax rate' },
              {
                validator(_, value) {
                  if (value < 0 || value > 100) {
                    return Promise.reject(new Error('Tax rate must be between 0 and 100'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" min={0} max={100} step="0.01" placeholder="Enter tax rate" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductRequestB2C;