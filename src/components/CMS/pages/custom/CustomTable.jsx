import React, { useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiRefreshCw } from 'react-icons/fi';
import { Input, Select, Button } from 'antd';

const { Option } = Select;

const CustomTable = ({
  columns,
  data,
  totalItems,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  onFilter,
  loading = false,
}) => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    isProductExpired: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value === '' ? undefined : value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    handleFilterChange('search', e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilter({ ...filters, search: searchTerm });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    // Note: Sorting is client-side here; server-side sorting would require an API callback
  };

  const handleClearFilters = () => {
    setFilters({ status: '', search: '', isProductExpired: '' });
    setSearchTerm('');
    onFilter({ status: '', search: '', isProductExpired: '' });
  };

  const handleRefresh = () => {
    onPageChange(currentPage, itemsPerPage);
  };

  const hasFilters = Object.values(filters).some((v) => v !== '' && v !== undefined);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <Button
          key="first"
          onClick={() => onPageChange(1, itemsPerPage)}
          className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          <FiChevronsLeft className="h-4 w-4" />
        </Button>
      );
    }

    // Previous page button
    buttons.push(
      <Button
        key="prev"
        onClick={() => onPageChange(currentPage - 1, itemsPerPage)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronLeft className="h-4 w-4" />
      </Button>
    );

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => onPageChange(i, itemsPerPage)}
          type={currentPage === i ? 'primary' : 'default'}
          className={`px-3 py-1 rounded-md ${currentPage === i ? '' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        >
          {i}
        </Button>
      );
    }

    // Next page button
    buttons.push(
      <Button
        key="next"
        onClick={() => onPageChange(currentPage + 1, itemsPerPage)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronRight className="h-4 w-4" />
      </Button>
    );

    // Last page button
    if (endPage < totalPages) {
      buttons.push(
        <Button
          key="last"
          onClick={() => onPageChange(totalPages, itemsPerPage)}
          className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          <FiChevronsRight className="h-4 w-4" />
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="bg-white shadow-xl overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              onPressEnter={handleSearchSubmit}
              className="pl-10 py-2"
            />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            {columns.filter((col) => col.filterable).map((column) => (
              <Select
                key={column.key}
                value={filters[column.filterKey || column.key] || ''}
                onChange={(value) => handleFilterChange(column.filterKey || column.key, value)}
                style={{ width: 200 }}
                allowClear
                placeholder={`All ${column.title}`}
              >
                <Option value="">All {column.title}</Option>
                {column.filterOptions?.map((option) => (
                  <Option key={option.value} value={option.value.toString()}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            ))}
            {hasFilters && (
              <Button
                type="default"
                onClick={handleClearFilters}
                className="flex items-center gap-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Clear Filters
              </Button>
            )}
            <Button
              type="default"
              icon={<FiRefreshCw />}
              onClick={handleRefresh}
              className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap  tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {sortConfig.key === column.key && (
                      <span className="ml-1 text-gray-400">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={`${item._id}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 gap-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-700 mr-2">
              Rows per page:
              <Select
                value={itemsPerPage}
                onChange={(value) => onPageChange(1, parseInt(value))}
                style={{ width: 80, marginLeft: 8 }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">{renderPaginationButtons()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;