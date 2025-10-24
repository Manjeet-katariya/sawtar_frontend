import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Tag, Modal, Dropdown, Space, Avatar, Typography, Empty, Spin, Alert } from 'antd';
import { VideoCameraOutlined, EyeOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Text, Title } = Typography;

const ProductGrid = ({ sortedProducts, showFilters, sortOption, setSortOption }) => {
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const colors = [
    { id: 'white', name: 'White', class: 'bg-white border-2 border-gray-200', hex: '#FFFFFF' },
    { id: 'black', name: 'Black', class: 'bg-gray-900', hex: '#111827' },
    { id: 'gray', name: 'Gray', class: 'bg-gray-500', hex: '#6B7280' },
    { id: 'beige', name: 'Beige', class: 'bg-amber-100', hex: '#FEF3C7' },
    { id: 'brown', name: 'Brown', class: 'bg-amber-800', hex: '#92400E' },
    { id: 'blue', name: 'Blue', class: 'bg-blue-500', hex: '#3B82F6' },
    { id: 'green', name: 'Green', class: 'bg-green-500', hex: '#10B981' },
  ];

  const materials = [
    { id: 'wood', name: 'Wood', icon: '🪵' },
    { id: 'metal', name: 'Metal', icon: '🔩' },
    { id: 'glass', name: 'Glass', icon: '🥃' },
    { id: 'ceramic', name: 'Ceramic', icon: '🏺' },
    { id: 'fabric', name: 'Fabric', icon: '🧵' },
    { id: 'stone', name: 'Stone', icon: '🪨' },
    { id: 'plastic', name: 'Plastic', icon: '🧴' },
  ];

  const designers = [
    { id: 1, name: 'Emma Wilson', specialty: 'Modern & Minimalist', rating: 4.9, experience: '8 years', image: null },
    { id: 2, name: 'James Rodriguez', specialty: 'Industrial & Loft', rating: 4.7, experience: '6 years', image: null },
    { id: 3, name: 'Sophia Chen', specialty: 'Scandinavian', rating: 4.8, experience: '7 years', image: null },
  ];

  const sortOptions = [
    { value: 'most-popular', label: 'Most Popular' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
  ];

  const handleSortChange = ({ key }) => setSortOption(key);

  const sortMenuProps = {
    items: sortOptions.map((option) => ({ key: option.value, label: option.label })),
    onClick: handleSortChange,
  };

  // Pagination logic
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const pageSizeOptions = [10, 20, 50];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  if (!sortedProducts || sortedProducts.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No products found"
        className="my-16"
      >
        <Text className="text-gray-500">Try adjusting your filters to find what you're looking for.</Text>
      </Empty>
    );
  }

  return (
    <div className={`p-2 ${showFilters ? 'lg:col-start-2' : 'col-span-full'}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <Text className="text-sm text-gray-600">
          Showing <Text className="font-semibold">{sortedProducts.length}</Text> products
        </Text>

        <Space size="middle">
          <Dropdown menu={sortMenuProps} placement="bottomRight">
            <Button className="flex items-center">
              Sort By <DownOutlined className="ml-2" />
            </Button>
          </Dropdown>

          <Button
            type="primary"
            icon={<VideoCameraOutlined />}
            onClick={() => setShowDesignerModal(true)}
            className="bg-orange-500 hover:bg-orange-600 border-orange-500 text-white"
          >
            Consult a Designer
          </Button>
        </Space>
      </div>

      {/* Product Grid */}
      <Row gutter={[24, 24]}>
        {paginatedProducts.map((product) => (
          <Col xs={24} sm={12} lg={8} key={product._id}>
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image Section */}
              <div className="relative pt-[75%] overflow-hidden">
                <img
                  alt={product.name}
                  src={`http://localhost:5000/${product.color_variants?.[0]?.images?.find((img) => img.is_primary)?.url?.replace(/\\/g, '/') || ''}`}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.tags?.map((tag) => (
                    <Tag key={tag._id} color="blue">
                      {tag.name}
                    </Tag>
                  ))}
                </div>

                <div
                  className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigate(`/sawtar/ecommerce/product/${product._id}`)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                      <EyeOutlined />
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex flex-col items-start mb-3">
                  <Text className="font-semibold text-base">{product.name}</Text>
                  <div className="flex items-center gap-2">
                    <Text className="font-semibold text-lg text-orange-500">
                      {product.pricing?.sale_price > 0
                        ? `${product.pricing.currency?.symbol || '₹'}${product.pricing.sale_price.toLocaleString('en-IN')}`
                        : `${product.pricing.currency?.symbol || '₹'}${product.pricing.final_price.toLocaleString('en-IN')}`}
                    </Text>
                    {product.pricing?.discount?.value > 0 && product.pricing?.discount?.approved && (
                      <>
                        <Text className="text-sm text-gray-500 line-through">
                          {product.pricing?.mrp ? `${product.pricing.currency?.symbol || '₹'}${product.pricing.mrp.toLocaleString('en-IN')}` : '-'}
                        </Text>
                        <Text className="text-xs text-green-600">
                          {product.pricing.discount.type === 'percentage'
                            ? `${product.pricing.discount.value}% OFF`
                            : `${product.pricing.currency?.symbol || '₹'}${product.pricing.discount.value} OFF`}
                        </Text>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Pricing Info */}
                <div className="flex flex-col mb-2">
                  <Text className="text-sm text-gray-600">
                    Cost Price: {product.pricing?.cost_price ? `${product.pricing.currency?.symbol || '₹'}${product.pricing.cost_price.toLocaleString('en-IN')}` : '-'}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Margin: {product.pricing?.margin ? `${product.pricing.margin}%` : '-'}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Tax Rate: {product.pricing?.tax?.rate ? `${product.pricing.tax.rate}%` : '-'}
                  </Text>
                </div>

                {/* Color Variants */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.color_variants?.map((variant) => (
                    <div
                      key={variant.color_name}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.color_code }}
                      title={variant.color_name}
                    />
                  ))}
                </div>

                {/* Product Properties */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <Tag>{materials.find((m) => m.id === product.material?.name)?.name || product.material?.name}</Tag>
                  <Tag>{product.category?.name}</Tag>
                  <Tag>{product.brand?.name}</Tag>
                </div>

                {/* Short Description */}
                <Text className="text-sm text-gray-600">{product.short_description}</Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Tailwind Pagination (shown only if products > 9) */}
      {totalProducts > 9 && (
        <div className="flex flex-col items-center mt-10">
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}-{endIndex} of {totalProducts} items
            </span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Designer Modal */}
      <Modal
        title="Consult With a Designer"
        open={showDesignerModal}
        onCancel={() => setShowDesignerModal(false)}
        footer={null}
        width={600}
      >
        <Text className="block mb-6 text-gray-600">
          Book a video consultation with one of our expert interior designers to get personalized recommendations.
        </Text>

        <Space direction="vertical" className="w-full" size="middle">
          {designers.map((designer) => (
            <div
              key={designer.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Avatar size={48} className="bg-orange-500 mr-3">
                  {designer.name.split(' ').map((n) => n[0]).join('')}
                </Avatar>
                <div>
                  <Text className="block font-semibold">{designer.name}</Text>
                  <Text className="text-xs text-gray-600">{designer.specialty}</Text>
                  <div className="flex items-center mt-1">
                    <Text className="text-xs text-gray-600">
                      {designer.rating} ({designer.experience})
                    </Text>
                  </div>
                </div>
              </div>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Book Session
              </button>
            </div>
          ))}
        </Space>
      </Modal>
    </div>
  );
};

ProductGrid.propTypes = {
  sortedProducts: PropTypes.array.isRequired,
  showFilters: PropTypes.bool.isRequired,
  sortOption: PropTypes.string.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default React.memo(ProductGrid);