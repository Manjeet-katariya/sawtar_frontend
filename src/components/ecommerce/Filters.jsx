import { useState } from 'react';
import { 
  Card, 
  Collapse, 
  Slider, 
  Checkbox, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Divider,
  Row,
  Col,
  Drawer
} from 'antd';
import { 
  FilterOutlined,
  CloseOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Title } = Typography;

const Filters = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedColors,
  setSelectedColors,
  selectedStyles,
  setSelectedStyles,
  selectedMaterials,
  setSelectedMaterials,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  showFilters,
  setShowFilters,
  resetFilters
}) => {
  // Data arrays without dummy icons
  const categories = [
    { id: 'furniture', name: 'Furniture' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'textiles', name: 'Textiles' },
    { id: 'decor', name: 'Decor' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'bath', name: 'Bath' },
    { id: 'outdoor', name: 'Outdoor' },
  ];

  const interiorStyles = [
    { id: 'modern', name: 'Modern', color: 'blue' },
    { id: 'minimalist', name: 'Minimalist', color: 'default' },
    { id: 'industrial', name: 'Industrial', color: 'orange' },
    { id: 'mid-century', name: 'Mid-Century', color: 'orange' },
    { id: 'scandinavian', name: 'Scandinavian', color: 'geekblue' },
    { id: 'bohemian', name: 'Bohemian', color: 'purple' },
    { id: 'traditional', name: 'Traditional', color: 'red' },
  ];

  const materials = [
    { id: 'wood', name: 'Wood' },
    { id: 'metal', name: 'Metal' },
    { id: 'glass', name: 'Glass' },
    { id: 'ceramic', name: 'Ceramic' },
    { id: 'fabric', name: 'Fabric' },
    { id: 'stone', name: 'Stone' },
    { id: 'plastic', name: 'Plastic' },
  ];

  const colors = [
    { id: 'white', name: 'White', hex: '#FFFFFF' },
    { id: 'black', name: 'Black', hex: '#111827' },
    { id: 'gray', name: 'Gray', hex: '#6B7280' },
    { id: 'beige', name: 'Beige', hex: '#FEF3C7' },
    { id: 'brown', name: 'Brown', hex: '#92400E' },
    { id: 'blue', name: 'Blue', hex: '#3B82F6' },
    { id: 'green', name: 'Green', hex: '#10B981' },
  ];

  const filterContent = (
    <>
      {/* Header with refined styling */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottom: '1px solid #e8ecef'
      }}>
        <Title level={4} style={{ 
          margin: 0, 
          fontWeight: 600, 
          color: '#1a1a1a' 
        }}>
          <FilterOutlined style={{ 
            marginRight: 8, 
            color: '#ff7a45',
            fontSize: 18 
          }} />
          Filters
        </Title>
        <Space size={8}>
          <Button 
            size="small" 
            icon={<ReloadOutlined />} 
            onClick={resetFilters}
            style={{
              borderRadius: 6,
              color: '#595959',
              borderColor: '#d9d9d9'
            }}
          >
            Reset
          </Button>
          <Button 
            size="small" 
            icon={<CloseOutlined />}
            onClick={() => setShowFilters(false)}
            style={{
              borderRadius: 6,
              color: '#595959',
              borderColor: '#d9d9d9'
            }}
          >
            Hide
          </Button>
        </Space>
      </div>

      <Collapse 
        defaultActiveKey={['categories', 'price', 'colors', 'styles', 'materials']}
        ghost
        expandIconPosition="right"
        style={{ background: 'transparent' }}
      >
        {/* Categories */}
        <Panel 
          header={<Text strong>Categories</Text>} 
          key="categories"
          style={{ borderBottom: '1px solid #e8ecef' }}
        >
          <Checkbox.Group 
            value={selectedCategories} 
            onChange={setSelectedCategories}
            style={{ width: '100%' }}
          >
            <Row gutter={[8, 8]}>
              {categories.map(category => (
                <Col span={24} key={category.id}>
                  <Checkbox 
                    value={category.id}
                    style={{ 
                      padding: '6px 0',
                      transition: 'color 0.3s'
                    }}
                  >
                    <Text style={{ 
                      fontSize: 14, 
                      color: '#1a1a1a',
                      transition: 'color 0.3s'
                    }}>
                      {category.name}
                    </Text>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Panel>

        {/* Price Range */}
        <Panel 
          header={<Text strong>Price Range</Text>} 
          key="price"
          style={{ borderBottom: '1px solid #e8ecef' }}
        >
          <div style={{ padding: '12px 0' }}>
            <Slider
              range
              min={0}
              max={5000}
              step={50}
              value={priceRange}
              onChange={setPriceRange}
              trackStyle={{ backgroundColor: '#ff7a45' }}
              handleStyle={{
                borderColor: '#ff7a45',
                backgroundColor: '#fff'
              }}
              tooltip={{
                formatter: (value) => `$${value}`,
                backgroundColor: '#ff7a45'
              }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: 12 
            }}>
              <Text style={{ fontSize: 13, color: '#595959' }}>
                ${priceRange[0]}
              </Text>
              <Text style={{ fontSize: 13, color: '#595959' }}>
                ${priceRange[1]}
              </Text>
            </div>
          </div>
        </Panel>

        {/* Colors */}
        <Panel 
          header={<Text strong>Colors</Text>} 
          key="colors"
          style={{ borderBottom: '1px solid #e8ecef' }}
        >
          <Checkbox.Group 
            value={selectedColors} 
            onChange={setSelectedColors}
            style={{ width: '100%' }}
          >
            <Row gutter={[8, 12]}>
              {colors.map(color => (
                <Col span={8} key={color.id}>
                  <Checkbox value={color.id}>
                    <Space direction="vertical" size={6} align="center">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background: color.hex,
                          border: color.id === 'white' 
                            ? '1px solid #d9d9d9' 
                            : '1px solid transparent',
                          transition: 'transform 0.2s',
                          ':hover': { transform: 'scale(1.1)' }
                        }}
                      />
                      <Text style={{ fontSize: 12, color: '#1a1a1a' }}>
                        {color.name}
                      </Text>
                    </Space>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Panel>

        {/* Interior Styles */}
        <Panel 
          header={<Text strong>Interior Styles</Text>} 
          key="styles"
          style={{ borderBottom: '1px solid #e8ecef' }}
        >
          <Checkbox.Group 
            value={selectedStyles} 
            onChange={setSelectedStyles}
            style={{ width: '100%' }}
          >
            <Row gutter={[8, 8]}>
              {interiorStyles.map(style => (
                <Col span={24} key={style.id}>
                  <Checkbox value={style.id}>
                    <Tag 
                      color={style.color} 
                      style={{ 
                        margin: 0,
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 12,
                        transition: 'background-color 0.3s'
                      }}
                    >
                      {style.name}
                    </Tag>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Panel>

        {/* Materials */}
        <Panel 
          header={<Text strong>Materials</Text>} 
          key="materials"
          style={{ borderBottom: '1px solid #e8ecef' }}
        >
          <Checkbox.Group 
            value={selectedMaterials} 
            onChange={setSelectedMaterials}
            style={{ width: '100%' }}
          >
            <Row gutter={[8, 8]}>
              {materials.map(material => (
                <Col span={24} key={material.id}>
                  <Checkbox 
                    value={material.id}
                    style={{ padding: '6px 0' }}
                  >
                    <Text style={{ fontSize: 14, color: '#1a1a1a' }}>
                      {material.name}
                    </Text>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Panel>
      </Collapse>

      {/* Active Filters Summary */}
      {(selectedCategories.length > 0 || selectedColors.length > 0 || 
        selectedStyles.length > 0 || selectedMaterials.length > 0 ||
        priceRange[0] > 0 || priceRange[1] < 5000) && (
        <div style={{ 
          marginTop: 20, 
          paddingTop: 12, 
          borderTop: '1px solid #e8ecef' 
        }}>
          <Text strong style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontSize: 14,
            color: '#1a1a1a'
          }}>
            Active Filters
          </Text>
          <Space size={[4, 8]} wrap>
            {selectedCategories.map(catId => {
              const cat = categories.find(c => c.id === catId);
              return cat && (
                <Tag 
                  key={cat.id} 
                  closable
                  onClose={() => {
                    setSelectedCategories(
                      selectedCategories.filter(id => id !== catId)
                    );
                  }}
                  style={{ 
                    borderRadius: 4, 
                    padding: '2px 8px',
                    fontSize: 12,
                    background: '#f5f5f5',
                    border: 'none'
                  }}
                >
                  {cat.name}
                </Tag>
              );
            })}
            {selectedColors.map(colorId => {
              const color = colors.find(c => c.id === colorId);
              return color && (
                <Tag 
                  key={color.id} 
                  closable
                  onClose={() => {
                    setSelectedColors(
                      selectedColors.filter(id => id !== colorId)
                    );
                  }}
                  style={{ 
                    borderRadius: 4, 
                    padding: '2px 8px',
                    fontSize: 12,
                    background: '#f5f5f5',
                    border: 'none'
                  }}
                >
                  {color.name}
                </Tag>
              );
            })}
            {selectedStyles.map(styleId => {
              const style = interiorStyles.find(s => s.id === styleId);
              return style && (
                <Tag 
                  key={style.id} 
                  closable
                  color={style.color}
                  onClose={() => {
                    setSelectedStyles(
                      selectedStyles.filter(id => id !== styleId)
                    );
                  }}
                  style={{ 
                    borderRadius: 4, 
                    padding: '2px 8px',
                    fontSize: 12
                  }}
                >
                  {style.name}
                </Tag>
              );
            })}
            {selectedMaterials.map(materialId => {
              const material = materials.find(m => m.id === materialId);
              return material && (
                <Tag 
                  key={material.id} 
                  closable
                  onClose={() => {
                    setSelectedMaterials(
                      selectedMaterials.filter(id => id !== materialId)
                    );
                  }}
                  style={{ 
                    borderRadius: 4, 
                    padding: '2px 8px',
                    fontSize: 12,
                    background: '#f5f5f5',
                    border: 'none'
                  }}
                >
                  {material.name}
                </Tag>
              );
            })}
            {(priceRange[0] > 0 || priceRange[1] < 5000) && (
              <Tag 
                closable
                onClose={() => setPriceRange([0, 5000])}
                style={{ 
                  borderRadius: 4, 
                  padding: '2px 8px',
                  fontSize: 12,
                  background: '#f5f5f5',
                  border: 'none'
                }}
              >
                Price: ${priceRange[0]} - ${priceRange[1]}
              </Tag>
            )}
          </Space>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Filters */}
      {showFilters && (
        <div style={{ display: 'block' }}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #e8ecef',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              position: 'sticky',
              top: 80,
              background: '#fff',
              transition: 'box-shadow 0.3s'
            }}
            bodyStyle={{ padding: '20px 24px' }}
            hoverable
          >
            {filterContent}
          </Card>
        </div>
      )}

      {/* Mobile Filters Button */}
      {!showFilters && (
        <div style={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 24, 
          zIndex: 1000 
        }}>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setMobileFiltersOpen(true)}
            size="large"
            style={{
              background: '#ff7a45',
              borderColor: '#ff7a45',
              borderRadius: 50,
              height: 48,
              width: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              ':hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
              }
            }}
          />
        </div>
      )}

      {/* Mobile Filters Drawer */}
      <Drawer
        title={<Text strong style={{ fontSize: 16, color: '#1a1a1a' }}>Filters</Text>}
        placement="right"
        onClose={() => setMobileFiltersOpen(false)}
        open={mobileFiltersOpen}
        width={300}
        bodyStyle={{ padding: '16px 20px', background: '#fff' }}
        headerStyle={{ borderBottom: '1px solid #e8ecef', padding: '12px 20px' }}
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined style={{ color: '#595959' }} />} 
            onClick={() => setMobileFiltersOpen(false)}
          />
        }
      >
        {filterContent}
      </Drawer>
    </>
  );
};

export default Filters;