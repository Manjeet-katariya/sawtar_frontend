
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import { Navigate } from 'react-router-dom';
import Navbar from './components/navbar/index.jsx';
import Footer from './components/footer/footer';
import FloatingIcons from './components/FloatingIcons';
import QuoteModal from './components/modal/QuoteModal.jsx';
import ScrollToTop from './components/ScrollToTop.js';
import Loader from './components/Loader.jsx';
import FreelancerNavbar from './components/navbar/FreelancerNavbar.jsx';
import EcommerceNavbar from './components/navbar/EcommerceNavbar.jsx';
import ProductFilterPage from './components/ecommerce/ProductFilterPage.jsx';
import Freelisting from './components/freelancers/Listing/Free-listing.jsx';
import Category from './components/freelancers/Category.jsx';
import CreateBusiness from './components/freelancers/Listing/CreateBusiness.jsx';
import Businesspage from './components/freelancers/Listing/Businesspage.jsx';
import Productdetails from './components/ecommerce/Productdetails.jsx';
import MainEcommercePage from './components/ecommerce/Index';
import HomeB2B from './components/ecommerce/B2B/Home';
import HomeB2C from './components/ecommerce/B2C/Home';
import CartPage from './components/ecommerce/CartPage';
import CmsApp from './components/CMS/CmsApp';
import AITool from './components/AI/Tool/AITool';
const NotFound = lazy(() => import('./components/NotFound'));
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Login from './components/login';
import Profile from './components/CMS/components/Profile/Profile';
import Employeedashboard from './components/CMS/pages/Employeedashboard';
import Customerdashboard from './components/CMS/pages/Customerdashboard';
import AdminLogin from './components/login/AdminLogin';
import SellerPage from './components/ecommerce/B2C/SellerPage';
import Sellerb2b from './components/ecommerce/B2C/Sellerb2b';

// Lazy-loaded components
const Home = lazy(() => import('./components/homepage/Home'));
const Consult = lazy(() => import('./components/consultation/Consult'));
const Designs = lazy(() => import('./components/AI/Designs'));
const Quotation = lazy(() => import('./components/quotation/Quotation'));
const Social = lazy(() => import('./components/social/Index'));
const Howitworks = lazy(() => import('./components/How-it-works/Index'));
const Completeproductview = lazy(() => import('./components/Completeproductview'));
const Designers = lazy(() => import('./components/Designers/Designers'));
const Freelancers = lazy(() => import('./components/freelancers/index'));
const Browsecategory = lazy(() => import('./components/freelancers/Browsecategory'));
const Mainfreelancers = lazy(() => import('./components/freelancers/Mainfreelancers'));
const FreelancerProfile = lazy(() => import('./components/freelancers/FreelancerProfile'));
const LivingRoom = lazy(() => import('./components/Interiorsection/livingroom/Index'));
const Bathroom = lazy(() => import('./components/Interiorsection/bathroom/Index'));
const Kitchen = lazy(() => import('./components/Interiorsection/kitchen/Index'));
const Studyroom = lazy(() => import('./components/Interiorsection/Studyroom/Index'));
const Wardrobe = lazy(() => import('./components/Interiorsection/wardrobe/Index'));
const Bedroom = lazy(() => import('./components/Interiorsection/bedroom/Index'));
const Registration = lazy(() => import('./components/freelancers/Registeration'));
const Magazine = lazy(() => import('./components/magazines/Index'));

// PrivateRoute component for protected routes
function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user || !user.role?.code) {
    return <Navigate to="/sawtar/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.code)) {
    return <Navigate to="/sawtar" replace />;
  }

  return children;
}

// LayoutWrapper manages visibility
function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideNavbarPaths = [
    '/sawtar/login',
    '/sawtar/quotation',
    '/sawtar/freelancer/browse-category',
    '/sawtar/freelancer/category',
    '/sawtar/ecommerce/filter',
    '/sawtar/freelancer/free-listing',
    '/sawtar/ecommerce/b2c',
    '/sawtar/ecommerce',
    '/sawtar/freelancer/create-business',
    '/sawtar/designs/Tool',
    '/sawtar/cms',
    '/sawtar/customer/dashboard',
    '/sawtar/admin/login',    '/sawtar/ecommerce/seller','/sawtar/ecommerce/cart'

  ];

  const hideNavbar =
    hideNavbarPaths.includes(location.pathname) ||
    location.pathname.startsWith('/sawtar/ecommerce/product/') ||
    location.pathname.startsWith('/sawtar/cms/');

  const showFreelancerNavbar =
    location.pathname === '/sawtar/freelancer/browse-category' ||
    location.pathname === '/sawtar/freelancer/free-listing' ||
    location.pathname === '/sawtar/freelancer/category' ||
    location.pathname === '/sawtar/freelancer/create-business';

  const showEcommerceNavbar =
    location.pathname === '/sawtar/ecommerce/b2c' ||
    location.pathname === '/sawtar/ecommerce/filter' ||
    location.pathname === '/sawtar/ecommerce' ||
        location.pathname === '/sawtar/ecommerce/cart' ||

    location.pathname.startsWith('/sawtar/ecommerce/product/');

  const hideFooterPaths = [
    '/sawtar/login',
    '/sawtar/quotation',
    '/sawtar/designs/Tool',
    '/sawtar/cms',
    '/sawtar/customer/dashboard',
    '/sawtar/profile',
    '/sawtar/admin/login',
        '/sawtar/ecommerce/seller'

  ];

  const hideFooter =
    hideFooterPaths.includes(location.pathname) ||
    location.pathname.startsWith('/sawtar/cms/') ||
    location.pathname.startsWith('/sawtar/profile/');

  const hideQuoteModalPaths = [
    '/sawtar/login',
    '/sawtar/quotation',
    '/sawtar/freelancer/browse-category',
    '/sawtar/freelancer/registration',
    '/sawtar/ecommerce/filter',
    '/sawtar/freelancer/free-listing',
    '/sawtar/freelancer/category',
    '/sawtar/freelancer/create-business',
    '/sawtar/freelancer/business',
    '/sawtar/freelancer/profile',
    '/sawtar/designs/Tool',
    '/sawtar/cms',
    '/sawtar/customer/dashboard',
    '/sawtar/admin/login',
    '/sawtar/ecommerce/seller',
    '/sawtar/ecommerce/product'
  ];

  const hideQuoteModal =
    hideQuoteModalPaths.includes(location.pathname) ||
    location.pathname.startsWith('/sawtar/cms/')||location.pathname.startsWith('/sawtar/ecommerce/product')||location.pathname.startsWith('/sawtar/ecommerce/cart')

  const hideFloatingIconsPaths = [
    '/sawtar/cms',
    '/sawtar/customer/dashboard',
    '/sawtar/designs/Tool',
    '/sawtar/profile',
    '/sawtar/admin/login','/sawtar/ecommerce/seller','/sawtar/ecommerce/product'

  ];

  const hideFloatingIcons =
    hideFloatingIconsPaths.includes(location.pathname) ||
    location.pathname.startsWith('/sawtar/cms/')||location.pathname.startsWith('/sawtar/ecommerce/product')||location.pathname.startsWith('/sawtar/ecommerce/cart');

  return (
    <div className="min-h-screen relative">
      {!hideNavbar && <Navbar />}
      {showFreelancerNavbar && <FreelancerNavbar />}
      {showEcommerceNavbar && <EcommerceNavbar />}
      {children}
      {!hideFooter && <Footer />}
      {!hideFloatingIcons && <FloatingIcons />}
      {!hideQuoteModal && <QuoteModal />}
    </div>
  );
}

function App() {
  return (
    <LayoutWrapper>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/sawtar/" element={<Home />} />
          <Route path="/sawtar/login" element={<Login />} />
          <Route path="/sawtar/admin/login" element={<AdminLogin />} />
          <Route path="/sawtar/consultation" element={<Consult />} />
          <Route path="/sawtar/designs" element={<Designs />} />
          <Route
            path="/sawtar/designs/Tool"
            element={
              <DndProvider backend={HTML5Backend}>
                <AITool />
              </DndProvider>
            }
          />
          <Route path="/sawtar/quotation" element={<Quotation />} />
          <Route path="/sawtar/ecommerce" element={<MainEcommercePage />} />
          <Route path="/sawtar/ecommerce/b2c" element={<HomeB2C />} />
                    <Route path="/sawtar/ecommerce/seller" element={<SellerPage />} />
                    <Route path="/sawtar/ecommerce/seller/b2b" element={<Sellerb2b />} />

          <Route path="/sawtar/ecommerce/b2b" element={<HomeB2B />} />
          <Route path="/sawtar/ecommerce/cart" element={<CartPage />} />
          <Route path="/sawtar/ecommerce/filter" element={<ProductFilterPage />} />
          <Route path="/sawtar/ecommerce/product/:id" element={<Productdetails />} />
          <Route path="/sawtar/social" element={<Social />} />
          <Route path="/sawtar/how-it-works" element={<Howitworks />} />
          <Route path="/sawtar/project-view" element={<Completeproductview />} />
          <Route path="/sawtar/designers" element={<Designers />} />
          <Route path="/sawtar/freelancer" element={<Freelancers />} />
          <Route path="/sawtar/freelancer/browse-category" element={<Browsecategory />} />
          <Route path="/sawtar/freelancer/category" element={<Category />} />
          <Route path="/sawtar/freelancer/home" element={<Mainfreelancers />} />
          <Route path="/sawtar/freelancer/profile" element={<FreelancerProfile />} />
          <Route path="/sawtar/freelancer/free-listing" element={<Freelisting />} />
          <Route path="/sawtar/freelancer/create-business" element={<CreateBusiness />} />
          <Route path="/sawtar/freelancer/business" element={<Businesspage />} />
          <Route path="/sawtar/freelancer/registration" element={<Registration />} />
          <Route path="/sawtar/interior/living-room" element={<LivingRoom />} />
          <Route path="/sawtar/interior/bathroom" element={<Bathroom />} />
          <Route path="/sawtar/interior/bedroom" element={<Bedroom />} />
          <Route path="/sawtar/interior/modular-kitchen" element={<Kitchen />} />
          <Route path="/sawtar/interior/study-room" element={<Studyroom />} />
          <Route path="/sawtar/interior/wardrobe" element={<Wardrobe />} />
          <Route path="/sawtar/magazines" element={<Magazine />} />
          <Route path="/sawtar/profile" element={<Profile />} />
          <Route path="/sawtar/customer/dashboard" element={<Customerdashboard />} />
          <Route
            path="/sawtar/cms/*"
            element={
              <PrivateRoute allowedRoles={['0', '1', '2', '3','6','5','8','7']}>
                <CmsApp />
              </PrivateRoute>
            }
          />
          <Route
            path="/sawtar/"
            element={
              <PrivateRoute allowedRoles={['2']}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </LayoutWrapper>
  );
}

export default App;
