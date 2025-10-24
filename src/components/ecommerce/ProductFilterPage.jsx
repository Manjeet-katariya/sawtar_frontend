import { useState, useEffect, useMemo } from 'react';
import { Layout, Card, Spin, Alert, Image } from 'antd';
import Filters from './Filters';
import ProductGrid from './ProductGrid';
import bannerImage from '../../assets/img/ecommercebanner.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../manageApi/store/productsSlice';

const { Content } = Layout;

const ProductFilterPage = () => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [sortOption, setSortOption] = useState('most-popular');
  const [openDropdown, setOpenDropdown] = useState({
    categories: true,
    price: true,
    colors: true,
    styles: true,
    materials: true,
    sort: false,
  });

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const toggleFilter = (filterType, id) => {
    const setters = {
      category: setSelectedCategories,
      color: setSelectedColors,
      style: setSelectedStyles,
      material: setSelectedMaterials,
    };
    setters[filterType]((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productPrice = product.pricing?.sale_price || 0;
      const productColors = product.color_variants?.map((v) => v.color_name.toLowerCase()) || [];
      const productCategory = product.category?.name || '';
      const productMaterial = product.material?.name || '';

      return (
        (selectedCategories.length === 0 || selectedCategories.includes(productCategory)) &&
        (selectedColors.length === 0 || selectedColors.some((color) => productColors.includes(color))) &&
        (selectedStyles.length === 0 || selectedStyles.includes(product.style)) &&
        (selectedMaterials.length === 0 || selectedMaterials.includes(productMaterial)) &&
        productPrice >= priceRange[0] &&
        productPrice <= priceRange[1]
      );
    });
  }, [products, selectedCategories, selectedColors, selectedStyles, selectedMaterials, priceRange]);

  // Sort products based on sortOption
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = a.pricing?.sale_price || 0;
      const priceB = b.pricing?.sale_price || 0;

      switch (sortOption) {
        case 'price-low-high':
          return priceA - priceB;
        case 'price-high-low':
          return priceB - priceA;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    });
  }, [filteredProducts, sortOption]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setPriceRange([0, 5000]);
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ background: 'white', minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px' }}>
        {error && (
          <Alert
            message={error}
            type="warning"
            showIcon
            closable
            style={{ margin: '16px 0' }}
          />
        )}

        {/* Banner Section */}
        <Card
          style={{
            margin: '16px 0',
            borderRadius: 12,
            border: '1px solid #f0f0f0',
            overflow: 'hidden',
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ position: 'relative', height: 200, background: '#fafafa' }}>
            <Image
              src={bannerImage}
              alt="Filter Banner"
              preview={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>
                  Discover Your Perfect Style
                </h2>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
                  Use our filters to find the ideal pieces for your home
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: showFilters ? '280px 1fr' : '1fr',
            gap: 24,
            marginBottom: 40,
          }}
        >
          <Filters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedStyles={selectedStyles}
            setSelectedStyles={setSelectedStyles}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            toggleFilter={toggleFilter}
            toggleDropdown={toggleDropdown}
            resetFilters={resetFilters}
          />

          <ProductGrid
            sortedProducts={sortedProducts}
            showFilters={showFilters}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default ProductFilterPage;