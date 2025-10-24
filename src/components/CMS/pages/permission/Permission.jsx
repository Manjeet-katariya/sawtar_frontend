import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Drawer,
  Form,
  Switch,
  Card,
  Space,
  Tag,
  Tooltip,
  Spin,
  Typography,
} from 'antd';
import {
  EyeOutlined,
  SaveOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import CustomTable from '../../pages/custom/CustomTable';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { showSuccessAlert, showErrorAlert } from '../../../../manageApi/utils/sweetAlert';

const Permission = () => {
  const { token } = useSelector((state) => state.auth);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPermissionDrawerOpen, setIsPermissionDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // Fetch roles, modules, and permissions
  const fetchData = async (page = 1, itemsPerPage = 10, filters = {}) => {
    setLoading(true);
    try {
      const params = { page, limit: itemsPerPage };
      if (filters.isActive !== undefined) params.isActive = filters.isActive === true;

      const [rolesRes, modulesRes, permissionsRes] = await Promise.all([
        apiService.get('/roles', params),
        apiService.get('/module', { limit: 100 }),
        apiService.get('/permission', { limit: 1000 }),
      ]);

      setRoles(rolesRes.roles || []);
      setModules(modulesRes.modules || []);
      setPermissions(permissionsRes.permissions || []);
      setPagination({
        currentPage: rolesRes.pagination.currentPage || 1,
        totalPages: rolesRes.pagination.totalPages || 1,
        totalResults: rolesRes.pagination.totalRecords || 0,
        itemsPerPage: rolesRes.pagination.perPage || 10,
      });

      // Create a map of role permissions for easier access
      const permissionsMap = {};
      permissionsRes.permissions.forEach((permission) => {
        const roleId = permission.roleId._id;
        if (!permissionsMap[roleId]) {
          permissionsMap[roleId] = {};
        }
        permissionsMap[roleId][permission.moduleId._id] = {
          id: permission._id,
          canAdd: !!permission.canAdd,
          canEdit: !!permission.canEdit,
          canView: !!permission.canView,
          canDelete: !!permission.canDelete,
          canViewAll: !!permission.canViewAll,
        };
      });
      setRolePermissions(permissionsMap);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.currentPage, pagination.itemsPerPage, filters);
  }, []);

  // Handle page change
  const handlePageChange = (page, itemsPerPage) => {
    fetchData(page, itemsPerPage, filters);
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchData(1, pagination.itemsPerPage, newFilters);
  };

  // Open drawer for viewing/editing role permissions
  const openPermissionDrawer = (role) => {
    setSelectedRole(role);
    setIsPermissionDrawerOpen(true);
  };

  // Close drawer
  const closePermissionDrawer = () => {
    setIsPermissionDrawerOpen(false);
    setSelectedRole(null);
  };

  // Handle permission change
  const handlePermissionChange = (moduleId, permissionType, value) => {
    setRolePermissions((prev) => {
      const newPermissions = { ...prev };

      if (!newPermissions[selectedRole._id]) {
        newPermissions[selectedRole._id] = {};
      }

      if (!newPermissions[selectedRole._id][moduleId]) {
        newPermissions[selectedRole._id][moduleId] = {
          canAdd: false,
          canEdit: false,
          canView: false,
          canDelete: false,
          canViewAll: false,
        };
      }

      newPermissions[selectedRole._id][moduleId][permissionType] = value;

      return newPermissions;
    });
  };

  // Save permissions
  const savePermissions = async () => {
    setSaving(true);
    try {
      const rolePerms = rolePermissions[selectedRole._id] || {};

      const toCreate = [];
      const toUpdate = [];
      const toDelete = [];

      Object.entries(rolePerms).forEach(([moduleId, perm]) => {
        const hasAnyPermission =
          perm.canAdd || perm.canEdit || perm.canView || perm.canDelete || perm.canViewAll;

        if (hasAnyPermission) {
          if (perm.id) {
            toUpdate.push({
              id: perm.id,
              data: {
                canAdd: perm.canAdd ? 1 : 0,
                canEdit: perm.canEdit ? 1 : 0,
                canView: perm.canView ? 1 : 0,
                canDelete: perm.canDelete ? 1 : 0,
                canViewAll: perm.canViewAll ? 1 : 0,
              },
            });
          } else {
            toCreate.push({
              roleId: selectedRole._id,
              moduleId,
              canAdd: perm.canAdd ? 1 : 0,
              canEdit: perm.canEdit ? 1 : 0,
              canView: perm.canView ? 1 : 0,
              canDelete: perm.canDelete ? 1 : 0,
              canViewAll: perm.canViewAll ? 1 : 0,
            });
          }
        } else if (perm.id) {
          toDelete.push(perm.id);
        }
      });

      await Promise.all(toDelete.map((id) => apiService.delete(`/permission/${id}`)));
      await Promise.all(toUpdate.map(({ id, data }) => apiService.put(`/permission/${id}`, data)));
      if (toCreate.length > 0) {
        await apiService.post('/permission', toCreate);
      }

      showSuccessAlert('Success', 'Permissions saved successfully');
      closePermissionDrawer();
      fetchData(pagination.currentPage, pagination.itemsPerPage, filters);
    } catch (error) {
      showErrorAlert('Error', error.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  // Get permission status for a role and module
  const getPermissionStatus = (roleId, moduleId) => {
    if (!rolePermissions[roleId] || !rolePermissions[roleId][moduleId]) {
      return 'No permissions';
    }

    const perms = rolePermissions[roleId][moduleId];
    const activePerms = [];

    if (perms.canView) activePerms.push('View');
    if (perms.canAdd) activePerms.push('Add');
    if (perms.canEdit) activePerms.push('Edit');
    if (perms.canDelete) activePerms.push('Delete');
    if (perms.canViewAll) activePerms.push('View All');

    return activePerms.length > 0 ? activePerms.join(', ') : 'No permissions';
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        key: 'name',
        title: 'Role Name',
        sortable: true,
        filterable: false,
        render: (value) => <span className="font-medium text-gray-900">{value}</span>,
      },
      {
        key: 'code',
        title: 'Role Code',
        sortable: true,
        filterable: false,
        render: (value) => <Tag color="blue">{value}</Tag>,
      },
      {
        key: 'description',
        title: 'Description',
        render: (value) => <span className="text-gray-900">{value || 'No description'}</span>,
      },
      {
        key: 'permissions',
        title: 'Permissions Summary',
        render: (value, record) => {
          const moduleCount = modules.length;
          let grantedCount = 0;

          if (rolePermissions[record._id]) {
            grantedCount = Object.keys(rolePermissions[record._id]).length;
          }

          return (
            <div>
              <span className="font-medium">{grantedCount}</span> of {moduleCount} modules
              <br />
              <span className="text-gray-500 text-xs">
                {grantedCount > 0 ? 'Some permissions granted' : 'No permissions set'}
              </span>
            </div>
          );
        },
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
          <Tag color={value ? 'green' : 'red'}>{value ? 'Active' : 'Inactive'}</Tag>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (value, record) => (
          <Space size="small">
            <Tooltip title="Manage Permissions">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => openPermissionDrawer(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [modules.length, rolePermissions]
  );

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={3} style={{ margin: 0, color: '#1f2937' }}>
          Role Permissions Management
        </Typography.Title>
       
      </div>

      <CustomTable
        columns={columns}
        data={roles}
        totalItems={pagination.totalResults}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={handlePageChange}
        onFilter={handleFilter}
        loading={loading}
      />

      <Drawer
        title={
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Permissions for {selectedRole?.name}
            </Typography.Title>
            <Typography.Text type="secondary">{selectedRole?.code}</Typography.Text>
          </div>
        }
        placement="right"
        onClose={closePermissionDrawer}
        open={isPermissionDrawerOpen}
        closeIcon={<CloseOutlined />}
        width={800}
        destroyOnClose
        maskClosable={false}
      >
        <div className="mt-4">
          {selectedRole && (
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              {modules.map((module) => {
                const modulePerms = rolePermissions[selectedRole._id]?.[module._id] || {
                  canAdd: false,
                  canEdit: false,
                  canView: false,
                  canDelete: false,
                  canViewAll: false,
                };

                return (
                  <Card key={module._id} style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <Typography.Title level={5}>{module.name}</Typography.Title>
                    <Typography.Text type="secondary">{module.description}</Typography.Text>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <Form.Item label="Can View">
                        <Switch
                          checked={modulePerms.canView}
                          onChange={(checked) => handlePermissionChange(module._id, 'canView', checked)}
                        />
                      </Form.Item>
                      <Form.Item label="Can Add">
                        <Switch
                          checked={modulePerms.canAdd}
                          onChange={(checked) => handlePermissionChange(module._id, 'canAdd', checked)}
                        />
                      </Form.Item>
                      <Form.Item label="Can Edit">
                        <Switch
                          checked={modulePerms.canEdit}
                          onChange={(checked) => handlePermissionChange(module._id, 'canEdit', checked)}
                        />
                      </Form.Item>
                      <Form.Item label="Can Delete">
                        <Switch
                          checked={modulePerms.canDelete}
                          onChange={(checked) => handlePermissionChange(module._id, 'canDelete', checked)}
                        />
                      </Form.Item>
                      <Form.Item label="Can View All">
                        <Switch
                          checked={modulePerms.canViewAll}
                          onChange={(checked) => handlePermissionChange(module._id, 'canViewAll', checked)}
                        />
                      </Form.Item>
                    </div>
                  </Card>
                );
              })}
            </Space>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={closePermissionDrawer}>Cancel</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={savePermissions}
            loading={saving}
          >
            Save Permissions
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Permission;