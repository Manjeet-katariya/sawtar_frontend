// src/components/CMS/pages/taxes/Taxes.jsx
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
import CustomTable from '../custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../../manageApi/utils/sweetAlert';
import { useForm, Controller } from 'react-hook-form';

const { Title } = Typography;

const Tax = () => {
  const { token } = useSelector((state) => state.auth);
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
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
      taxName: '',
      rate: '',
      status: true,
    },
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    fetchTaxes();
  }, [token]);

const fetchTaxes = async (page = 1, itemsPerPage = 10, filters = {}) => {
  setLoading(true);
  try {
    const params = { page, limit: itemsPerPage };

    // Ensure correct mapping for status filter (1, 0, or skip)
    if (filters.status !== undefined && filters.status !== null && filters.status !== '') {
      params.status = Number(filters.status); // Convert string/boolean to 0 or 1
    }

    const response = await apiService.get('/setting/tax', params);

    setTaxes(response.taxes || []);
    setPagination({
      currentPage: response.pagination.currentPage || 1,
      totalPages: response.pagination.totalPages || 1,
      totalResults: response.pagination.totalRecords || 0,
      itemsPerPage: response.pagination.perPage || 10,
    });
  } catch (error) {
    console.error('Fetch taxes error:', error);
    showToast(error.response?.data?.message || 'Failed to fetch taxes', 'error');
  } finally {
    setLoading(false);
  }
};

const handleFilter = (newFilters) => {
  console.log('Applied filters:', newFilters);

  // If filter is cleared, reset everything
  if (!newFilters || Object.keys(newFilters).length === 0 || newFilters.status === undefined || newFilters.status === '') {
    setFilters({});
    fetchTaxes(1, pagination.itemsPerPage, {});
  } else {
    // Convert boolean or string to number (0 or 1)
    const formattedFilters = {
      ...newFilters,
      status: newFilters.status === true || newFilters.status === '1' ? 1
        : newFilters.status === false || newFilters.status === '0' ? 0
        : undefined,
    };

    setFilters(formattedFilters);
    fetchTaxes(1, pagination.itemsPerPage, formattedFilters);
  }
};


  const handlePageChange = (page, itemsPerPage) => {
    fetchTaxes(page, itemsPerPage, filters);
  };


  const openEditTax = (tax) => {
    setEditingTax(tax);
    reset({
      taxName: tax.taxName,
      rate: tax.rate.toString(),
      status: tax.status === 1,
    });
    clearErrors();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTax(null);
    reset();
    clearErrors();
  };

  const handleSaveTax = async (data) => {
    try {
      setSubmitting(true);
      const payload = {
        taxName: data.taxName,
        rate: parseFloat(data.rate),
        status: data.status ? 1 : 0,
      };
      let response;
      if (editingTax) {
        response = await apiService.put(`/setting/tax/${editingTax._id}`, payload);
        setTaxes(taxes.map((t) => (t._id === editingTax._id ? response.tax : t)));
        showSuccessAlert('Success', 'Tax updated successfully');
      } else {
        response = await apiService.post('/setting/tax', payload);
        setTaxes([...taxes, response.tax]);
        showSuccessAlert('Success', 'Tax created successfully');
      }
      setIsModalOpen(false);
      setEditingTax(null);
      reset();
      clearErrors();
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.field, { type: 'manual', message: err.message });
        });
        showErrorAlert('Error', 'Please correct the errors in the form');
      } else {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to save tax');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDeleteTax = async (taxId) => {
    const result = await showConfirmDialog(
      'Confirm Soft Delete',
      'Are you sure you want to soft delete this tax? It will be marked as inactive.',
      'Delete'
    );

    if (result.isConfirmed) {
      try {
        await apiService.delete(`/setting/tax/${taxId}`);
        setTaxes(taxes.map((t) => (t._id === taxId ? { ...t, status: 0 } : t)));
        showSuccessAlert('Success', 'Tax soft deleted successfully');
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to soft delete tax');
      }
    }
  };

  const handlePermanentDeleteTax = async (taxId) => {
    const result = await showConfirmDialog(
      'Confirm Permanent Delete',
      'Are you sure you want to permanently delete this tax? This action cannot be undone.',
      'Delete Permanently',
      'error'
    );

    if (result.isConfirmed) {
      try {
        await apiService.delete(`/setting/tax/${taxId}/permanent`);
        setTaxes(taxes.filter((t) => t._id !== taxId));
        showSuccessAlert('Success', 'Tax permanently deleted successfully');
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to permanently delete tax');
      }
    }
  };

  const handleRestoreTax = async (taxId) => {
    const result = await showConfirmDialog(
      'Confirm Restore',
      'Are you sure you want to restore this tax? It will be marked as active.',
      'Restore'
    );

    if (result.isConfirmed) {
      try {
        await apiService.put(`/setting/tax/${taxId}/restore`);
        setTaxes(taxes.map((t) => (t._id === taxId ? { ...t, status: 1 } : t)));
        showSuccessAlert('Success', 'Tax restored successfully');
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || 'Failed to restore tax');
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'taxName',
        title: 'Tax Name',
        sortable: true,
        filterable: false,
        render: (value) => <span className="font-medium text-gray-900">{value}</span>,
      },
      {
        key: 'rate',
        title: 'Rate (%)',
        sortable: true,
        render: (value) => <span className="text-gray-900">{value.toFixed(2)}%</span>,
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
                onClick={() => openEditTax(record)}
              />
            </Tooltip>
            {record.status === 1 ? (
              <Popconfirm
                title="Are you sure to soft delete this tax?"
                onConfirm={() => handleSoftDeleteTax(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ) : (
              <>
                <Popconfirm
                  title="Are you sure to restore this tax?"
                  onConfirm={() => handleRestoreTax(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<UndoOutlined />} />
                </Popconfirm>
                <Popconfirm
                  title="Are you sure to permanently delete this tax?"
                  onConfirm={() => handlePermanentDeleteTax(record._id)}
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
          Tax Management
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTax(null);
              reset();
              setIsModalOpen(true);
            }}
            size="large"
          >
            Add Tax
          </Button>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={() => fetchTaxes(pagination.currentPage, pagination.itemsPerPage, filters)}
            size="large"
          >
            Refresh
          </Button>
        </Space>
      </div>

      <CustomTable
        columns={columns}
        data={taxes}
        totalItems={pagination.totalResults}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={handlePageChange}
        onFilter={handleFilter}
        loading={loading}
      />

      <Modal
        title={editingTax ? 'Edit Tax' : 'Add New Tax'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={600}
        className="rounded-lg"
      >
        <Form layout="vertical" onFinish={handleSubmit(handleSaveTax)} className="mt-4">
          <Controller
            name="taxName"
            control={control}
            rules={{
              required: 'Please input the tax name!',
              maxLength: { value: 50, message: 'Tax name cannot exceed 50 characters' },
              pattern: {
                value: /^[a-zA-Z0-9\s\-&]+$/,
                message: 'Tax name can only contain letters, numbers, spaces, hyphens, and ampersands',
              },
            }}
            render={({ field }) => (
              <Form.Item
                label="Tax Name"
                validateStatus={formErrors.taxName ? 'error' : ''}
                help={formErrors.taxName?.message}
              >
                <Input {...field} placeholder="Enter tax name" />
              </Form.Item>
            )}
          />
          <Controller
            name="rate"
            control={control}
            rules={{
              required: 'Please input the tax rate!',
              validate: (value) =>
                parseFloat(value) >= 0 && parseFloat(value) <= 100
                  ? true
                  : 'Tax rate must be between 0 and 100',
            }}
            render={({ field }) => (
              <Form.Item
                label="Rate (%)"
                validateStatus={formErrors.rate ? 'error' : ''}
                help={formErrors.rate?.message}
              >
                <Input {...field} type="number" step="0.01" placeholder="Enter tax rate" />
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
                {editingTax ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tax;