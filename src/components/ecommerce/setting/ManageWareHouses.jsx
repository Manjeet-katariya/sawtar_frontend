import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus, FiRefreshCw, FiEdit, FiTrash2, FiMapPin, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import { Button, Spin, Input, Select, Modal, Form, InputNumber, Card, Table, Space, Tooltip, Badge, message } from 'antd';
import { apiService } from '../../../manageApi/utils/custom.apiservice';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../manageApi/utils/sweetAlert';

const { Search } = Input;
const { Option } = Select;

const ManageWarehouses = () => {
  const { user } = useSelector((state) => state.auth);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [form] = Form.useForm();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch warehouses
  const fetchWarehouses = useCallback(async (page = 1, pageSize = 10, filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        vendor_id: user.id,
        ...filters,
      };
      
      const response = await apiService.get('/vendor/warehouses', params);
      setWarehouses(response.warehouses || []);
      setPagination({
        current: response.pagination?.page || 1,
        pageSize: response.pagination?.limit || 10,
        total: response.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      showErrorAlert('Error', error.response?.data?.message || 'Failed to fetch warehouses');
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  // Fetch warehouses on mount or when filters change
  useEffect(() => {
    if (user.id) {
      fetchWarehouses(pagination.current, pagination.pageSize, filters);
    }
  }, [user.id, refreshTrigger, pagination.current, pagination.pageSize, filters, fetchWarehouses]);

  // Handle table pagination
  const handleTableChange = (newPagination) => {
    fetchWarehouses(newPagination.current, newPagination.pageSize, filters);
  };

  // Handle filter changes
  const handleFilter = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchWarehouses(1, pagination.pageSize, updatedFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Show modal for create/edit
  const showModal = (warehouse = null) => {
    setEditingWarehouse(warehouse);
    if (warehouse) {
      form.setFieldsValue({
        name: warehouse.name,
        code: warehouse.code,
        address: warehouse.address,
        city: warehouse.city,
        state: warehouse.state,
        country: warehouse.country,
        contact_person: warehouse.contact_person,
        phone: warehouse.phone,
        email: warehouse.email,
        capacity_units: warehouse.capacity_units,
        active: warehouse.active,
      });
    } else {
      form.setFieldsValue({
        active: true,
        capacity_units: 1000,
        country: 'India'
      });
    }
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingWarehouse) {
        await apiService.put(`/vendor/warehouses/${editingWarehouse._id}`, values);
        showSuccessAlert('Success', 'Warehouse updated successfully');
      } else {
        await apiService.post('/vendor/warehouses', values);
        showSuccessAlert('Success', 'Warehouse created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingWarehouse(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving warehouse:', error);
      showErrorAlert('Error', error.response?.data?.message || 'Failed to save warehouse');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (warehouse) => {
    const result = await showConfirmDialog(
      'Delete Warehouse',
      `Are you sure you want to delete "${warehouse.name}"? This action cannot be undone.`,
      'Yes, Delete'
    );

    if (result.isConfirmed) {
      try {
        await apiService.delete(`/vendor/warehouses/${warehouse._id}`);
        showSuccessAlert('Deleted', 'Warehouse deleted successfully');
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting warehouse:', error);
        showErrorAlert('Error', error.response?.data?.message || 'Failed to delete warehouse');
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (warehouse) => {
    try {
      await apiService.put(`/vendor/warehouses/${warehouse._id}`, {
        active: !warehouse.active,
      });
      showSuccessAlert('Success', 'Warehouse status updated successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating warehouse status:', error);
      showErrorAlert('Error', error.response?.data?.message || 'Failed to update warehouse status');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Name & Code',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <div className="text-sm text-gray-500">Code: {record.code}</div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'address',
      key: 'location',
      width: 250,
      render: (text, record) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600 mb-1">
            <FiMapPin className="text-xs" />
            {text || 'N/A'}
          </div>
          <div className="text-gray-500">
            {[record.city, record.state, record.country].filter(Boolean).join(', ')}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'contact_person',
      key: 'contact',
      width: 200,
      render: (text, record) => (
        <div className="text-sm">
          {text && (
            <div className="flex items-center gap-1 mb-1">
              <FiUser className="text-xs" />
              {text}
            </div>
          )}
          {record.phone && (
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <FiPhone className="text-xs" />
              {record.phone}
            </div>
          )}
          {record.email && (
            <div className="flex items-center gap-1 text-gray-600">
              <FiMail className="text-xs" />
              <span className="truncate">{record.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity_units',
      key: 'capacity',
      width: 120,
      render: (text) => (
        <span className="font-medium">{text ? `${text.toLocaleString()} units` : 'Not set'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'status',
      width: 100,
      render: (active) => (
        <Badge
          status={active ? 'success' : 'error'}
          text={active ? 'Active' : 'Inactive'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Warehouse">
            <Button
              type="link"
              icon={<FiEdit />}
              onClick={() => showModal(record)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Tooltip title={record.active ? 'Deactivate' : 'Activate'}>
            <Button
              type="link"
              danger={record.active}
              onClick={() => handleStatusToggle(record)}
              className={record.active ? 'text-orange-600' : 'text-green-600'}
            >
              {record.active ? 'Deactivate' : 'Activate'}
            </Button>
          </Tooltip>
          <Tooltip title="Delete Warehouse">
            <Button
              type="link"
              danger
              icon={<FiTrash2 />}
              onClick={() => handleDelete(record)}
              className="text-red-600 hover:text-red-800"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Warehouses</h1>
            <p className="text-gray-600 mt-1">Create and manage your warehouse locations</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              icon={<FiRefreshCw className={loading ? 'animate-spin' : ''} />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<FiPlus />}
              onClick={() => showModal()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Warehouse
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6" bodyStyle={{ padding: '16px' }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <Search
              placeholder="Search by name or code..."
              allowClear
              style={{ width: 300 }}
              onSearch={(value) => handleFilter({ search: value })}
              onPressEnter={(e) => handleFilter({ search: e.target.value })}
            />
            <Input
              placeholder="Filter by city..."
              style={{ width: 200 }}
              value={filters.city}
              onChange={(e) => handleFilter({ city: e.target.value })}
            />
            <Input
              placeholder="Filter by state..."
              style={{ width: 200 }}
              value={filters.state}
              onChange={(e) => handleFilter({ state: e.target.value })}
            />
            <Button 
              onClick={() => {
                setFilters({ search: '', city: '', state: '' });
                fetchWarehouses(1, pagination.pageSize, {});
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Warehouses Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={warehouses}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `Showing ${range[0]}-${range[1]} of ${total} warehouses`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={editingWarehouse ? 'Edit Warehouse' : 'Create New Warehouse'}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingWarehouse(null);
            form.resetFields();
          }}
          footer={null}
          width={700}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark="optional"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Warehouse Name"
                rules={[{ required: true, message: 'Please enter warehouse name' }]}
              >
                <Input placeholder="Enter warehouse name" />
              </Form.Item>

              <Form.Item
                name="code"
                label="Warehouse Code"
                rules={[{ required: true, message: 'Please enter warehouse code' }]}
              >
                <Input placeholder="Enter unique code" />
              </Form.Item>
            </div>

            <Form.Item
              name="address"
              label="Full Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea placeholder="Enter full address" rows={2} />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>

              <Form.Item
                name="state"
                label="State/Province"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input placeholder="Enter state" />
              </Form.Item>

              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Please enter country' }]}
              >
                <Input placeholder="Enter country" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="contact_person"
                label="Contact Person"
                rules={[{ required: true, message: 'Please enter contact person' }]}
              >
                <Input placeholder="Enter contact person name" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="capacity_units"
              label="Storage Capacity (Units)"
              rules={[{ required: true, message: 'Please enter capacity' }]}
            >
              <InputNumber
                min={1}
                placeholder="Enter capacity in units"
                className="w-full"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            {editingWarehouse && (
              <Form.Item name="active" label="Status">
                <Select>
                  <Option value={true}>Active</Option>
                  <Option value={false}>Inactive</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button 
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingWarehouse(null);
                    form.resetFields();
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submitting}
                >
                  {editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageWarehouses;