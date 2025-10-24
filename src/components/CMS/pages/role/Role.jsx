import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Space,
  Tag,
  Popconfirm,
  Tooltip,
  Tabs,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import CustomTable from '../../pages/custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../../manageApi/utils/sweetAlert';

const { Option } = Select;
const { TextArea } = Input;

const Role = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [roles, setRoles] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState({ roles: false, platforms: false });
  const [isModalOpen, setIsModalOpen] = useState({ role: false, platform: false });
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('roles');

  const [rolePagination, setRolePagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });
  const [platformPagination, setPlatformPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({ roles: {}, platforms: {} });

  const { control, handleSubmit, reset, setError, clearErrors, formState: { errors } } = useForm({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      category: '',
      isSuperAdmin: false,
      parentRole: '',
    },
  });

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // Fetch roles
  const fetchRoles = async (page = 1, itemsPerPage = 10, filters = {}) => {
    setLoading((prev) => ({ ...prev, roles: true }));
    try {
      const params = { page, limit: itemsPerPage };
      if (filters.category) params.category = filters.category;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;

      const response = await apiService.get('/roles', params);
      setRoles(response.roles || []);
      setRolePagination({
        currentPage: response.pagination.currentPage || 1,
        totalPages: response.pagination.totalPages || 1,
        totalResults: response.pagination.totalRecords || 0,
        itemsPerPage: response.pagination.perPage || 10,
      });
    } catch (error) {
      console.error('Fetch roles error:', error);
      showToast(error.response?.data?.message || 'Failed to fetch roles', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, roles: false }));
    }
  };

  // Fetch platforms
  const fetchPlatforms = async (page = 1, itemsPerPage = 10, filters = {}) => {
    setLoading((prev) => ({ ...prev, platforms: true }));
    try {
      const params = { page, limit: itemsPerPage };
      if (filters.isActive !== undefined) params.isActive = filters.isActive;

      const response = await apiService.get('/platform', params);
      setPlatforms(response.platforms || []);
      setPlatformPagination({
        currentPage: response.pagination.currentPage || 1,
        totalPages: response.pagination.totalPages || 1,
        totalResults: response.pagination.totalRecords || 0,
        itemsPerPage: response.pagination.perPage || 10,
      });
    } catch (error) {
      console.error('Fetch platforms error:', error);
      showToast(error.response?.data?.message || 'Failed to fetch platforms', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, platforms: false }));
    }
  };

  // Handle page change
  const handlePageChange = (type, page, itemsPerPage) => {
    if (type === 'roles') {
      fetchRoles(page, itemsPerPage, filters.roles);
    } else {
      fetchPlatforms(page, itemsPerPage, filters.platforms);
    }
  };

  // Handle filter change
  const handleFilter = (type, newFilters) => {
    setFilters((prev) => ({ ...prev, [type]: newFilters }));
    if (type === 'roles') {
      fetchRoles(1, rolePagination.itemsPerPage, newFilters);
    } else {
      fetchPlatforms(1, platformPagination.itemsPerPage, newFilters);
    }
  };

  // Open modal for adding/editing
  const openModal = (type, item = null) => {
    setEditingItem(item);
    reset({
      code: item?.code || '',
      name: item?.name || '',
      description: item?.description || '',
      category: item?.category?._id || '',
      isSuperAdmin: item?.isSuperAdmin || false,
      parentRole: item?.parentRole?._id || '',
    });
    clearErrors();
    setIsModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  // Handle modal cancel
  const handleCancel = (type) => {
    setIsModalOpen((prev) => ({ ...prev, [type]: false }));
    reset();
    clearErrors();
  };

  // Submit form (create or update)
  const onSubmit = async (values) => {
    const isRole = activeTab === 'roles';
    const endpoint = isRole ? '/roles' : '/platform';
    const id = editingItem?._id;
    try {
      setSubmitting(true);
      if (editingItem) {
        await apiService.put(`${endpoint}/${id}`, values);
        showSuccessAlert('Success', `${isRole ? 'Role' : 'Platform'} updated successfully`);
      } else {
        await apiService.post(endpoint, values);
        showSuccessAlert('Success', `${isRole ? 'Role' : 'Platform'} created successfully`);
      }
      setIsModalOpen((prev) => ({ ...prev, [activeTab]: false }));
      reset();
      if (isRole) {
        fetchRoles(rolePagination.currentPage, rolePagination.itemsPerPage, filters.roles);
      } else {
        fetchPlatforms(platformPagination.currentPage, platformPagination.itemsPerPage, filters.platforms);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.field, { type: 'manual', message: err.message });
        });
        showErrorAlert('Error', 'Please correct the errors in the form');
      } else {
        showErrorAlert('Error', error.response?.data?.message || `Failed to save ${isRole ? 'role' : 'platform'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Soft delete
  const handleSoftDelete = async (type, item) => {
    const result = await showConfirmDialog(
      'Confirm Soft Delete',
      `Are you sure you want to soft delete the ${type === 'roles' ? 'role' : 'platform'} "${item.name}"? It will be marked as inactive.`,
      'Delete'
    );

    if (result.isConfirmed) {
      try {
        const endpoint = type === 'roles' ? `/roles/${item._id}` : `/platform/${item._id}`;
        await apiService.delete(endpoint);
        showSuccessAlert('Success', `${type === 'roles' ? 'Role' : 'Platform'} soft deleted successfully`);
        if (type === 'roles') {
          fetchRoles(rolePagination.currentPage, rolePagination.itemsPerPage, filters.roles);
        } else {
          fetchPlatforms(platformPagination.currentPage, platformPagination.itemsPerPage, filters.platforms);
        }
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || `Failed to soft delete ${type === 'roles' ? 'role' : 'platform'}`);
      }
    }
  };

  // Permanent delete
  const handlePermanentDelete = async (type, item) => {
    const result = await showConfirmDialog(
      'Confirm Permanent Delete',
      `Are you sure you want to permanently delete the ${type === 'roles' ? 'role' : 'platform'} "${item.name}"? This action cannot be undone.`,
      'Delete Permanently',
      'error'
    );

    if (result.isConfirmed) {
      try {
        const endpoint = type === 'roles' ? `/roles/${item._id}/permanent` : `/platform/${item._id}/permanent`;
        await apiService.delete(endpoint);
        showSuccessAlert('Success', `${type === 'roles' ? 'Role' : 'Platform'} permanently deleted successfully`);
        if (type === 'roles') {
          fetchRoles(rolePagination.currentPage, rolePagination.itemsPerPage, filters.roles);
        } else {
          fetchPlatforms(platformPagination.currentPage, platformPagination.itemsPerPage, filters.platforms);
        }
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || `Failed to permanently delete ${type === 'roles' ? 'role' : 'platform'}`);
      }
    }
  };

  // Restore
  const handleRestore = async (type, item) => {
    const result = await showConfirmDialog(
      'Confirm Restore',
      `Are you sure you want to restore the ${type === 'roles' ? 'role' : 'platform'} "${item.name}"? It will be marked as active.`,
      'Restore'
    );

    if (result.isConfirmed) {
      try {
        const endpoint = type === 'roles' ? `/roles/${item._id}/restore` : `/platform/${item._id}/restore`;
        await apiService.put(endpoint);
        showSuccessAlert('Success', `${type === 'roles' ? 'Role' : 'Platform'} restored successfully`);
        if (type === 'roles') {
          fetchRoles(rolePagination.currentPage, rolePagination.itemsPerPage, filters.roles);
        } else {
          fetchPlatforms(platformPagination.currentPage, platformPagination.itemsPerPage, filters.platforms);
        }
      } catch (error) {
        showErrorAlert('Error', error.response?.data?.message || `Failed to restore ${type === 'roles' ? 'role' : 'platform'}`);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRoles(rolePagination.currentPage, rolePagination.itemsPerPage, filters.roles);
    fetchPlatforms(platformPagination.currentPage, platformPagination.itemsPerPage, filters.platforms);
  }, []);

  // Role table columns
  const roleColumns = useMemo(
    () => [
      {
        key: 'code',
        title: 'Code',
        sortable: true,
        filterable: false,
        render: (value) => <span className="font-medium text-gray-900">{value}</span>,
      },
      {
        key: 'name',
        title: 'Name',
        sortable: true,
        filterable: false,
        render: (value) => <span className="text-gray-900">{value}</span>,
      },
      {
        key: 'category.name',
        title: 'Category',
        sortable: true,
        filterable: true,
        filterKey: 'category',
        filterOptions: platforms
          .filter((p) => p.isActive)
          .map((p) => ({ value: p._id, label: p.name })),
        render: (value, item) => <span className="text-gray-900">{item.category?.name || '--'}</span>,
      },
      {
        key: 'description',
        title: 'Description',
        render: (value) => <span className="text-gray-900">{value || '--'}</span>,
      },
      {
        key: 'isSuperAdmin',
        title: 'Super Admin',
        render: (value) => (
          <Tag color={value ? 'purple' : 'default'}>
            {value ? 'Yes' : 'No'}
          </Tag>
        ),
      },
      {
        key: 'isActive',
        title: 'Status',
        sortable: true,
        filterable: true,
        filterKey: 'isActive',
        filterOptions: [
          { value: true, label: 'Active' },
          { value: false, label: 'Inactive' },
        ],
        render: (value) => (
          <Tag color={value ? 'green' : 'red'}>
            {value ? 'Active' : 'Inactive'}
          </Tag>
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
        render: (value, item) => (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openModal('role', item)}
              />
            </Tooltip>
            {item.isActive ? (
              <Popconfirm
                title={`Are you sure to soft delete this role?`}
                onConfirm={() => handleSoftDelete('roles', item)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                />
              </Popconfirm>
            ) : (
              <>
                <Popconfirm
                  title={`Are you sure to restore this role?`}
                  onConfirm={() => handleRestore('roles', item)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    icon={<UndoOutlined />}
                  />
                </Popconfirm>
                <Popconfirm
                  title={`Are you sure to permanently delete this role?`}
                  onConfirm={() => handlePermanentDelete('roles', item)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    danger
                  />
                </Popconfirm>
              </>
            )}
          </Space>
        ),
      },
    ],
    [platforms]
  );

  // Platform table columns
  const platformColumns = useMemo(
    () => [
      {
        key: 'name',
        title: 'Name',
        sortable: true,
        filterable: false,
        render: (value) => <span className="font-medium text-gray-900">{value}</span>,
      },
      {
        key: 'description',
        title: 'Description',
        render: (value) => <span className="text-gray-900">{value || '--'}</span>,
      },
      {
        key: 'isActive',
        title: 'Status',
        sortable: true,
        filterable: true,
        filterKey: 'isActive',
        filterOptions: [
          { value: true, label: 'Active' },
          { value: false, label: 'Inactive' },
        ],
        render: (value) => (
          <Tag color={value ? 'green' : 'red'}>
            {value ? 'Active' : 'Inactive'}
          </Tag>
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
        render: (value, item) => (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openModal('platform', item)}
              />
            </Tooltip>
            {item.isActive ? (
              <Popconfirm
                title={`Are you sure to soft delete this platform?`}
                onConfirm={() => handleSoftDelete('platforms', item)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                />
              </Popconfirm>
            ) : (
              <>
                <Popconfirm
                  title={`Are you sure to restore this platform?`}
                  onConfirm={() => handleRestore('platforms', item)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    icon={<UndoOutlined />}
                  />
                </Popconfirm>
                <Popconfirm
                  title={`Are you sure to permanently delete this platform?`}
                  onConfirm={() => handlePermanentDelete('platforms', item)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    danger
                  />
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
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Role & Platform Management</h1>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={[
          {
            label: 'Roles',
            key: 'roles',
            children: (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal('role')}
                    size="large"
                  >
                    Add Role
                  </Button>
                </div>
                <CustomTable
                  columns={roleColumns}
                  data={roles}
                  totalItems={rolePagination.totalResults}
                  currentPage={rolePagination.currentPage}
                  itemsPerPage={rolePagination.itemsPerPage}
                  onPageChange={(page, itemsPerPage) => handlePageChange('roles', page, itemsPerPage)}
                  onFilter={(filters) => handleFilter('roles', filters)}
                  loading={loading.roles}
                />
              </div>
            ),
          },
          {
            label: 'Platforms',
            key: 'platforms',
            children: (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Platforms</h2>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal('platform')}
                    size="large"
                  >
                    Add Platform
                  </Button>
                </div>
                <CustomTable
                  columns={platformColumns}
                  data={platforms}
                  totalItems={platformPagination.totalResults}
                  currentPage={platformPagination.currentPage}
                  itemsPerPage={platformPagination.itemsPerPage}
                  onPageChange={(page, itemsPerPage) => handlePageChange('platforms', page, itemsPerPage)}
                  onFilter={(filters) => handleFilter('platforms', filters)}
                  loading={loading.platforms}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Role Modal */}
      <Modal
        title={editingItem ? 'Edit Role' : 'Add New Role'}
        open={isModalOpen.role}
        onCancel={() => handleCancel('role')}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={600}
        className="rounded-lg"
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="mt-4"
        >
          <Controller
            name="code"
            control={control}
            rules={{ required: 'Please enter role code' }}
            render={({ field }) => (
              <Form.Item
                label="Code"
                validateStatus={errors.code ? 'error' : ''}
                help={errors.code?.message}
              >
                <Input {...field} placeholder="Enter code" />
              </Form.Item>
            )}
          />
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Please enter role name' }}
            render={({ field }) => (
              <Form.Item
                label="Name"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Input {...field} placeholder="Enter name" />
              </Form.Item>
            )}
          />
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Please select a category' }}
            render={({ field }) => (
              <Form.Item
                label="Category"
                validateStatus={errors.category ? 'error' : ''}
                help={errors.category?.message}
              >
                <Select
                  {...field}
                  placeholder="Select category"
                  loading={loading.platforms}
                  disabled={loading.platforms}
                >
                  {platforms
                    .filter((p) => p.isActive)
                    .map((platform) => (
                      <Option key={platform._id} value={platform._id}>
                        {platform.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          />
          <Controller
            name="parentRole"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Parent Role"
                validateStatus={errors.parentRole ? 'error' : ''}
                help={errors.parentRole?.message}
              >
                <Select
                  {...field}
                  placeholder="Select parent role (optional)"
                  allowClear
                  loading={loading.roles}
                  disabled={loading.roles}
                >
                  {roles
                    .filter((r) => r.isActive)
                    .map((role) => (
                      <Option key={role._id} value={role._id}>
                        {role.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Item label="Description">
                <TextArea {...field} rows={3} placeholder="Enter description" />
              </Form.Item>
            )}
          />
          <Controller
            name="isSuperAdmin"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Form.Item>
                <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)}>
                  Super Admin Role
                </Checkbox>
              </Form.Item>
            )}
          />
          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => handleCancel('role')}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Platform Modal */}
      <Modal
        title={editingItem ? 'Edit Platform' : 'Add New Platform'}
        open={isModalOpen.platform}
        onCancel={() => handleCancel('platform')}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={600}
        className="rounded-lg"
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="mt-4"
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Please enter platform name' }}
            render={({ field }) => (
              <Form.Item
                label="Name"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Input {...field} placeholder="Enter name" />
              </Form.Item>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Item label="Description">
                <TextArea {...field} rows={3} placeholder="Enter description" />
              </Form.Item>
            )}
          />
          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => handleCancel('platform')}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Role;