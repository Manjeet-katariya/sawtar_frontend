import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiPlus,
  FiRefreshCw,
  FiClock,
  FiEdit,
  FiArrowLeft,
  FiBox,
  FiAlertTriangle,
  FiEye,
} from 'react-icons/fi';
import {
  Button,
  Card,
  Table,
  Input,
  Form,
  Select,
  DatePicker,
  Spin,
  message,
  Modal,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Pagination,
  Tabs,
  Empty,InputNumber
} from 'antd';
import moment from 'moment';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { debounce } from 'lodash';

const { Title, Text: TypographyText } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Inventory = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [historyPagination, setHistoryPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    sku: '',
    warehouse: '',
  });
  const [historyFilters, setHistoryFilters] = useState({
    type: '',
    startDate: null,
    endDate: null,
  });
  const [warehouses, setWarehouses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [form] = Form.useForm();

  // Get sku from query params for history filtering
  const searchParams = new URLSearchParams(location.search);
  const historySku = searchParams.get('sku') || '';

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // Fetch warehouses
  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await apiService.get('/vendor/warehouses', { vendor_id: user.id });
      if (response.success) {
        setWarehouses(response.warehouses || []);
      } else {
        throw new Error(response.message || 'Failed to fetch warehouses');
      }
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to fetch warehouses', 'error');
    }
  }, [user.id]);

  // Fetch inventory
  const fetchInventory = useCallback(
    async (page = 1, pageSize = 10, filters = {}) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pageSize,
          sku: filters.sku || undefined,
          warehouse: filters.warehouse || undefined,
        };
        const response = await apiService.get(`/products/${productId}/inventory`, params);
        if (response.success) {
          setInventory(response.inventory || []);
          setPagination({
            current: response.pagination?.page || 1,
            pageSize: response.pagination?.limit || 10,
            total: response.pagination?.total || 0,
          });
        } else {
          throw new Error(response.message || 'Failed to fetch inventory');
        }
      } catch (error) {
        showToast(error.response?.data?.message || error.message || 'Failed to fetch inventory', 'error');
        setInventory([]);
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  // Fetch inventory history
  const fetchInventoryHistory = useCallback(
    async (page = 1, pageSize = 10, filters = {}) => {
      setHistoryLoading(true);
      try {
        const params = {
          page,
          limit: pageSize,
          sku: historySku || filters.sku || undefined,
          type: filters.type || undefined,
          startDate: filters.startDate ? moment(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? moment(filters.endDate).toISOString() : undefined,
        };
        const response = await apiService.get(`/products/${productId}/inventory/history`, params);
        if (response.success) {
          setHistory(response.movements || []);
          setHistoryPagination({
            current: response.pagination?.page || 1,
            pageSize: response.pagination?.limit || 10,
            total: response.pagination?.total || 0,
          });
        } else {
          throw new Error(response.message || 'Failed to fetch inventory history');
        }
      } catch (error) {
        showToast(error.response?.data?.message || error.message || 'Failed to fetch inventory history', 'error');
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [productId, historySku]
  );

  // Debounced filter handler
  const debouncedHandleFilter = useCallback(
    debounce((newFilters) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchInventory(1, pagination.pageSize, updatedFilters);
    }, 500),
    [fetchInventory, pagination.pageSize]
  );

  // Debounced history filter handler
  const debouncedHandleHistoryFilter = useCallback(
    debounce((newFilters) => {
      const updatedFilters = { ...historyFilters, ...newFilters };
      setHistoryFilters(updatedFilters);
      fetchInventoryHistory(1, historyPagination.pageSize, updatedFilters);
    }, 500),
    [fetchInventoryHistory, historyPagination.pageSize]
  );

  // Fetch data on mount
  useEffect(() => {
    if (user.id && productId) {
      fetchWarehouses();
      fetchInventory(pagination.current, pagination.pageSize, filters);
      fetchInventoryHistory(historyPagination.current, historyPagination.pageSize, {
        ...historyFilters,
        sku: historySku,
      });
    }
  }, [user.id, productId, refreshTrigger, fetchWarehouses, fetchInventory, fetchInventoryHistory, historySku]);

  // Handle table pagination
  const handleTableChange = (page, pageSize) => {
    fetchInventory(page, pageSize, filters);
  };

  // Handle history table pagination
  const handleHistoryTableChange = (page, pageSize) => {
    fetchInventoryHistory(page, pageSize, historyFilters);
  };

  // Show modal for create/edit
  const showModal = (inventoryItem = null) => {
    setEditingInventory(inventoryItem);
    if (inventoryItem) {
      form.setFieldsValue({
        sku: inventoryItem.sku || '',
        quantity: inventoryItem.quantity || '',
        low_stock_threshold: inventoryItem.low_stock_threshold || 5,
        warehouse: inventoryItem.warehouse?._id || '',
        expiry_date: inventoryItem.expiry_date ? moment(inventoryItem.expiry_date) : null,
        type: 'adjustment',
        note: '',
      });
    } else {
      form.setFieldsValue({
        sku: '',
        quantity: '',
        low_stock_threshold: 5,
        warehouse: '',
        expiry_date: null,
        type: 'initial',
        note: '',
      });
    }
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        sku: values.sku.trim(),
        quantity: parseInt(values.quantity),
        low_stock_threshold: parseInt(values.low_stock_threshold),
        warehouse: values.warehouse,
        note: values.note || undefined,
        type: values.type,
      };

      if (values.expiry_date) {
        payload.expiry_date = moment(values.expiry_date).toISOString();
      }

      let response;
      if (editingInventory) {
        response = await apiService.put(`/products/${productId}/inventory`, payload);
      } else {
        response = await apiService.post(`/products/${productId}/inventory/create`, payload);
      }

      if (response.success) {
        message.success(
          response.message || (editingInventory ? 'Inventory updated successfully' : 'Inventory created successfully')
        );
        setIsModalVisible(false);
        setEditingInventory(null);
        setRefreshTrigger((prev) => prev + 1);
        form.resetFields();
      } else {
        throw new Error(response.message || 'Failed to save inventory');
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message || 'Failed to save inventory');
    }
  };

  // Inventory table columns
  const inventoryColumns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (text) => <TypographyText strong>{text || '--'}</TypographyText>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => text || 0,
    },
    {
      title: 'Reserved',
      dataIndex: 'reserved',
      key: 'reserved',
      render: (text) => text || 0,
    },
    {
      title: 'Low Stock',
      dataIndex: 'low_stock',
      key: 'low_stock',
      render: (low_stock) => (
        <Tag color={low_stock ? 'red' : 'green'} icon={low_stock ? <FiAlertTriangle /> : null}>
          {low_stock ? 'Low' : 'Normal'}
        </Tag>
      ),
    },
    {
      title: 'Threshold',
      dataIndex: 'low_stock_threshold',
      key: 'low_stock_threshold',
      render: (text) => text || 5,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      render: (warehouse) => warehouse?.name || 'N/A',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (date) => (
        <TypographyText type={date && new Date(date) < new Date() ? 'danger' : ''}>
          {date ? new Date(date).toLocaleDateString('en-GB') : '--'}
        </TypographyText>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => (date ? new Date(date).toLocaleDateString('en-GB') : '--'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<FiClock />}
            onClick={() =>
              navigate(`/sawtar/cms/seller/b2c/product/inventory/${productId}/history?sku=${record.sku}`)
            }
            title="View History"
          />
          <Button
            type="link"
            icon={<FiEdit />}
            onClick={() => showModal(record)}
            title="Update Inventory"
          />
        </Space>
      ),
    },
  ];

  // History table columns
  const historyColumns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (text) => text || '--',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <TypographyText style={{ textTransform: 'capitalize' }}>{text}</TypographyText>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (text) => text || '-',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString('en-GB'),
    },
  ];

  if (loading && inventory.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Spin size="large" />
        <TypographyText style={{ marginLeft: 16, color: '#666' }}>Loading inventory...</TypographyText>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Manage Inventory
            </Title>
          </Col>
         
          
          <Col>
            <Space>
              <Button
                icon={<FiRefreshCw className={loading ? 'anticon-spin' : ''} />}
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<FiPlus />}
                onClick={() => showModal()}
              >
                Add Inventory
              </Button>
               <Col>
           
                       <FiArrowLeft
                         onClick={() => navigate(-1)}
                         style={{ fontSize: '24px', cursor: 'pointer', color: '#1890ff' }}
                       />
                     
          </Col>
            </Space>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="inventory" type="card">
        <TabPane tab={<Space><FiBox /> Inventory</Space>} key="inventory">
          <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by SKU..."
                  value={filters.sku}
                  onChange={(e) => debouncedHandleFilter({ sku: e.target.value })}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Warehouse"
                  value={filters.warehouse}
                  onChange={(value) => debouncedHandleFilter({ warehouse: value })}
                  allowClear
                >
                  <Option value="">All Warehouses</Option>
                  {warehouses.map((wh) => (
                    <Option key={wh._id} value={wh._id}>{wh.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Button
                  onClick={() => debouncedHandleFilter({ sku: '', warehouse: '' })}
                  style={{ width: '100%' }}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
            <Table
              columns={inventoryColumns}
              dataSource={inventory}
              rowKey="_id"
              loading={loading}
              pagination={false}
              locale={{
                emptyText: <Empty description="No inventory found" imageStyle={{ height: 60 }} />,
              }}
            />
            {pagination.total > pagination.pageSize && (
              <Pagination
                style={{ marginTop: 16, textAlign: 'center' }}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handleTableChange}
                showSizeChanger
                onShowSizeChange={handleTableChange}
              />
            )}
          </Card>
        </TabPane>
        <TabPane tab={<Space><FiClock /> History {historySku ? `(SKU: ${historySku})` : ''}</Space>} key="history">
          <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Type"
                  value={historyFilters.type}
                  onChange={(value) => debouncedHandleHistoryFilter({ type: value })}
                  allowClear
                >
                  <Option value="">All Types</Option>
                  <Option value="initial">Initial</Option>
                  <Option value="in">Stock In</Option>
                  <Option value="out">Stock Out</Option>
                  <Option value="adjustment">Adjustment</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Start Date"
                  value={historyFilters.startDate ? moment(historyFilters.startDate) : null}
                  onChange={(date) => debouncedHandleHistoryFilter({ startDate: date })}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="End Date"
                  value={historyFilters.endDate ? moment(historyFilters.endDate) : null}
                  onChange={(date) => debouncedHandleHistoryFilter({ endDate: date })}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  onClick={() => debouncedHandleHistoryFilter({ type: '', startDate: null, endDate: null })}
                  style={{ width: '100%' }}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
            <Table
              columns={historyColumns}
              dataSource={history}
              rowKey={(record, index) => `${record.sku}-${index}`}
              loading={historyLoading}
              pagination={false}
              locale={{
                emptyText: <Empty description="No inventory history found" imageStyle={{ height: 60 }} />,
              }}
            />
            {historyPagination.total > historyPagination.pageSize && (
              <Pagination
                style={{ marginTop: 16, textAlign: 'center' }}
                current={historyPagination.current}
                pageSize={historyPagination.pageSize}
                total={historyPagination.total}
                onChange={handleHistoryTableChange}
                showSizeChanger
                onShowSizeChange={handleHistoryTableChange}
              />
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* Create/Edit Modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        centered
        title={editingInventory ? 'Update Inventory' : 'Create New Inventory'}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: 'SKU is required' }]}
          >
            <Input disabled={!!editingInventory} />
          </Form.Item>
     <Form.Item
  label="Quantity"
  name="quantity"
  rules={[
    { required: true, message: 'Quantity is required' },
    { type: 'number', min: 0, message: 'Quantity cannot be negative' },
  ]}
>
  <InputNumber min={0} style={{ width: '100%' }} />
</Form.Item>
          <Form.Item
            label="Low Stock Threshold"
            name="low_stock_threshold"
            rules={[
              { required: true, message: 'Low stock threshold is required' },
              { type: 'number', min: 0, message: 'Threshold cannot be negative' },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Warehouse"
            name="warehouse"
            rules={[{ required: true, message: 'Warehouse is required' }]}
          >
            <Select placeholder="Select Warehouse">
              {warehouses.map((wh) => (
                <Option key={wh._id} value={wh._id}>{wh.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Expiry Date"
            name="expiry_date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Movement Type"
            name="type"
            rules={[{ required: true, message: 'Movement type is required' }]}
          >
            <Select>
              <Option value="initial">Initial</Option>
              <Option value="in">Stock In</Option>
              <Option value="out">Stock Out</Option>
              <Option value="adjustment">Adjustment</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Note"
            name="note"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={form.isFieldsValidating()}>
                {editingInventory ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;