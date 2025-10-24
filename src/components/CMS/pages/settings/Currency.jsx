// src/components/CMS/pages/currencies/Currencies.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Typography,
  Popconfirm,
  Tooltip,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import CustomTable from '../../pages/custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../../manageApi/utils/sweetAlert';
import { useForm, Controller } from 'react-hook-form';

const { Title } = Typography;

const Currency = () => {
  const { token } = useSelector((state) => state.auth);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({});

  const { control, handleSubmit, reset, setError, clearErrors, formState: { errors: formErrors } } = useForm({
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
      exchangeRate: '',
      isDefault: false,
      status: true,
    },
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    fetchCurrencies();
  }, [token]);

const fetchCurrencies = async (page = 1, itemsPerPage = 10, filters = {}) => {
  setLoading(true);
  try {
    const params = { page, limit: itemsPerPage };

    // ✅ Correct filter handling
    if (filters.status !== undefined && filters.status !== null && filters.status !== '') {
      params.status = Number(filters.status); // Convert 1/0 or true/false properly
    }

    if (filters.isDefault !== undefined && filters.isDefault !== null && filters.isDefault !== '') {
      params.isDefault = filters.isDefault === true || filters.isDefault === 'true';
    }

    const response = await apiService.get('/setting/currency', params);

    setCurrencies(response.currencies || []);
    setPagination({
      currentPage: response.pagination.currentPage || 1,
      totalPages: response.pagination.totalPages || 1,
      totalResults: response.pagination.totalRecords || 0,
      itemsPerPage: response.pagination.perPage || 10,
    });
  } catch (error) {
    showToast(error.response?.data?.message || 'Failed to fetch currencies', 'error');
  } finally {
    setLoading(false);
  }
};

const handleFilter = (newFilters) => {
  console.log('🔍 Applied filters:', newFilters);

  // ✅ If filters cleared, reset table
  if (!newFilters || Object.keys(newFilters).length === 0) {
    setFilters({});
    fetchCurrencies(1, pagination.itemsPerPage, {});
    return;
  }

  // ✅ Normalize filter values before sending
  const formattedFilters = {
    ...newFilters,
    status:
      newFilters.status === true || newFilters.status === '1'
        ? 1
        : newFilters.status === false || newFilters.status === '0'
        ? 0
        : undefined,
    isDefault:
      newFilters.isDefault === true || newFilters.isDefault === 'true'
        ? true
        : newFilters.isDefault === false || newFilters.isDefault === 'false'
        ? false
        : undefined,
  };

  setFilters(formattedFilters);
  fetchCurrencies(1, pagination.itemsPerPage, formattedFilters);
};


  const handlePageChange = (page, itemsPerPage) => {
    fetchCurrencies(page, itemsPerPage, filters);
  };


  const openEditCurrency = (currency) => {
    setEditingCurrency(currency);
    reset({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate.toString(),
      isDefault: currency.isDefault,
      status: currency.status === 1,
    });
    clearErrors();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCurrency(null);
    reset();
    clearErrors();
  };

  const handleSaveCurrency = async (data) => {
    try {
      setSubmitting(true);
      const payload = {
        code: data.code.toUpperCase(),
        name: data.name,
        symbol: data.symbol,
        exchangeRate: parseFloat(data.exchangeRate),
        isDefault: data.isDefault,
        status: data.status ? 1 : 0,
      };
      let response;
      if (editingCurrency) {
        response = await apiService.put(`/setting/currency/${editingCurrency._id}`, payload);
        setCurrencies(currencies.map((c) => (c._id === editingCurrency._id ? response.currency : c)));
        showSuccessAlert('Success', 'Currency updated successfully');
      } else {
        response = await apiService.post('/setting/currency', payload);
        setCurrencies([...currencies, response.currency]);
        showSuccessAlert('Success', 'Currency created successfully');
      }
      setIsModalOpen(false);
      setEditingCurrency(null);
      reset();
      clearErrors();
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.field, { type: 'manual', message: err.message });
        });
        showErrorAlert('Error', 'Please correct the errors in the form');
      } else {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to save currency');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDeleteCurrency = async (currencyId) => {
    const result = await showConfirmDialog(
      'Confirm Soft Delete',
      'Are you sure you want to soft delete this currency? It will be marked as inactive.',
      'Delete'
    );

    if (result.isConfirmed) {
      try {
        await apiService.delete(`/setting/currency/${currencyId}`);
        setCurrencies(currencies.map((c) => (c._id === currencyId ? { ...c, status: 0 } : c)));
        showSuccessAlert('Success', 'Currency soft deleted successfully');
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to soft delete currency');
      }
    }
  };

  const handlePermanentDeleteCurrency = async (currencyId) => {
    const result = await showConfirmDialog(
      'Confirm Permanent Delete',
      'Are you sure you want to permanently delete this currency? This action cannot be undone.',
      'Delete Permanently',
      'error'
    );

    if (result.isConfirmed) {
      try {
        await apiService.delete(`/setting/currency/${currencyId}/permanent`);
        setCurrencies(currencies.filter((c) => c._id !== currencyId));
        showSuccessAlert('Success', 'Currency permanently deleted successfully');
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to permanently delete currency');
      }
    }
  };

  const handleRestoreCurrency = async (currencyId) => {
    const result = await showConfirmDialog(
      'Confirm Restore',
      'Are you sure you want to restore this currency? It will be marked as active.',
      'Restore'
    );

    if (result.isConfirmed) {
      try {
        await apiService.put(`/setting/currency/${currencyId}/restore`);
        setCurrencies(currencies.map((c) => (c._id === currencyId ? { ...c, status: 1 } : c)));
        showSuccessAlert('Success', 'Currency restored successfully');
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to restore currency');
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'code',
        title: 'Code',
        sortable: true,
        render: (value) => <span className="font-medium text-gray-900">{value}</span>,
      },
      {
        key: 'name',
        title: 'Name',
        sortable: true,
        render: (value) => <span className="text-gray-900">{value}</span>,
      },
      {
        key: 'symbol',
        title: 'Symbol',
        render: (value) => <span className="text-gray-900">{value}</span>,
      },
      {
        key: 'exchangeRate',
        title: 'Exchange Rate',
        sortable: true,
        render: (value) => <span className="text-gray-900">{value.toFixed(4)}</span>,
      },
      {
        key: 'isDefault',
        title: 'Default',
        sortable: true,
        filterable: true,
        filterKey: 'isDefault',
        filterOptions: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
        render: (value) => (
          <Tag color={value ? 'green' : 'red'}>{value ? 'Yes' : 'No'}</Tag>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        sortable: true,
        filterable: true,
        filterKey: 'status',
        filterOptions: [
          { value: 1, label: 'Active' },
          { value: 0, label: 'Inactive' },
        ],
        render: (value) => (
          <Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? 'Active' : 'Inactive'}</Tag>
        ),
      },
      {
        key: 'createdAt',
        title: 'Created At',
        sortable: true,
        render: (value) => (
          <span className="text-gray-900">{value ? new Date(value).toLocaleDateString() : '--'}</span>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (value, record) => (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openEditCurrency(record)}
              />
            </Tooltip>
            {record.status === 1 ? (
              <Popconfirm
                title="Are you sure to soft delete this currency?"
                onConfirm={() => handleSoftDeleteCurrency(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ) : (
              <>
                <Popconfirm
                  title="Are you sure to restore this currency?"
                  onConfirm={() => handleRestoreCurrency(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<UndoOutlined />} />
                </Popconfirm>
                <Popconfirm
                  title="Are you sure to permanently delete this currency?"
                  onConfirm={() => handlePermanentDeleteCurrency(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </>
            )}
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen ">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
          Currency Management
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCurrency(null);
              reset();
              setIsModalOpen(true);
            }}
            size="large"
          >
            Add Currency
          </Button>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={() => fetchCurrencies(pagination.currentPage, pagination.itemsPerPage, filters)}
            size="large"
          >
            Refresh
          </Button>
        </Space>
      </div>

      <CustomTable
        columns={columns}
        data={currencies}
        totalItems={pagination.totalResults}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={handlePageChange}
        onFilter={handleFilter}
        loading={loading}
      />

      <Modal
        title={editingCurrency ? 'Edit Currency' : 'Add New Currency'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={600}
        className="rounded-lg"
      >
        <Form layout="vertical" onFinish={handleSubmit(handleSaveCurrency)} className="mt-4">
          <Controller
            name="code"
            control={control}
            rules={{
              required: 'Please input the currency code!',
              pattern: {
                value: /^[A-Z]{3}$/,
                message: 'Code must be a 3-letter ISO code (e.g., USD)',
              },
            }}
            render={({ field }) => (
              <Form.Item
                label="Code"
                validateStatus={formErrors.code ? 'error' : ''}
                help={formErrors.code?.message}
              >
                <Input {...field} placeholder="Enter code (e.g., USD)" />
              </Form.Item>
            )}
          />
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Please input the currency name!',
              maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
            }}
            render={({ field }) => (
              <Form.Item
                label="Name"
                validateStatus={formErrors.name ? 'error' : ''}
                help={formErrors.name?.message}
              >
                <Input {...field} placeholder="Enter name" />
              </Form.Item>
            )}
          />
          <Controller
            name="symbol"
            control={control}
            rules={{ required: 'Please input the currency symbol!' }}
            render={({ field }) => (
              <Form.Item
                label="Symbol"
                validateStatus={formErrors.symbol ? 'error' : ''}
                help={formErrors.symbol?.message}
              >
                <Input {...field} placeholder="Enter symbol (e.g., $)" />
              </Form.Item>
            )}
          />
          <Controller
            name="exchangeRate"
            control={control}
            rules={{
              required: 'Please input the exchange rate!',
              validate: (value) =>
                parseFloat(value) > 0 ? true : 'Exchange rate must be positive',
            }}
            render={({ field }) => (
              <Form.Item
                label="Exchange Rate"
                validateStatus={formErrors.exchangeRate ? 'error' : ''}
                help={formErrors.exchangeRate?.message}
              >
                <Input {...field} type="number" step="0.0001" placeholder="Enter exchange rate" />
              </Form.Item>
            )}
          />
          <Controller
            name="isDefault"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Form.Item label="Default Currency">
                <Switch
                  checked={value}
                  onChange={onChange}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Form.Item label="Status">
                <Switch
                  checked={value}
                  onChange={onChange}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
              </Form.Item>
            )}
          />
          <Form.Item className="text-right">
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingCurrency ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Currency;