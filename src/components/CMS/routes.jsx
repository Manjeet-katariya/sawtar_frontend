// Updated CmsRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '../CMS/pages/Dashboard'; // Assuming this is for admins/superadmins
import ContentList from '../CMS/pages/content/ContentList';
import ContentEdit from '../CMS/pages/content/ContentEdit';
import Overview from '../CMS/pages/analytics/Overview';
import Reports from '../CMS/pages/analytics/Reports';
import Profile from '../CMS/pages/settings/Profile';
import System from '../CMS/pages/settings/System';
import Customerdashboard from './pages/Customerdashboard';
import Employeedashboard from './pages/Employeedashboard';
import CustomerList from './pages/dashboardPages/managevendor/VendorB2C'; // Note: This seems misnamed, but keeping as is
import VendorRequest from './pages/dashboardPages/managevendor/VendorB2B';
import Freelancerrequest from './pages/dashboardPages/Freelancerrequest';
import Permission from './pages/permission/Permission';
import Role from './pages/role/Role';
import Admins from './pages/users/Admins';
import Modules from './pages/modules/Modules';
import Vendors from './pages/dashboardPages/managevendor/VendorB2C';
import AddProducts from '../../components/ecommerce/B2C/products/AddProducts';
import VendorProfile from './pages/dashboardPages/managevendor/VendorProfile';
import VendorDashboard from './pages/Vendordashboard';
import MyProfile from './pages/dashboardPages/managevendor/vendorprofile/Vendorb2b-MyProfile';
import VendorB2B from './pages/dashboardPages/managevendor/VendorB2B';
import VendorB2BProfile from './pages/dashboardPages/managevendor/VendorB2BProfile';
import VendorB2C from './pages/dashboardPages/managevendor/VendorB2C';
import VendorB2CProfile from './pages/dashboardPages/managevendor/VendorB2CProfile';
import MyProfileb2b from './pages/dashboardPages/managevendor/vendorprofile/Vendorb2b-MyProfile';
import MyProfileb2c from './pages/dashboardPages/managevendor/vendorprofile/Vendorb2c-Myprofile';
import BusinessRequest from './pages/dashboardPages/managefreelancer/BusinessRequest';
import BusinessProfile from './pages/dashboardPages/managefreelancer/BusinessProfile';
import BusinessDashboard from './pages/BusinessDashboard';
import MyprofileBusiness from './pages/dashboardPages/managefreelancer/Business-Myprofile';
import Freelancers from './pages/dashboardPages/managefreelancer/freelancer/Freelancers';
import FreelancerProfile from './pages/dashboardPages/managefreelancer/freelancer/FreelancerProfile';
import MyprofileFreelancer from './pages/dashboardPages/managefreelancer/freelancer/MyprofileFreelancer';
import Attributes from '../ecommerce/B2C/products/Attributes';
import AddAttributes from '../ecommerce/B2C/products/AddAttributes';
import AddMaterial from '../ecommerce/B2C/products/AddMaterial';
import AddBrand from '../ecommerce/B2C/products/AddBrand';
import AddCategory from '../ecommerce/B2C/products/AddCategory';
import AddTags from '../ecommerce/B2C/products/AddTags';
import ProductRequestB2C from './pages/dashboardPages/manageProducts/ProductRequestB2C';
import ProductReview from './pages/dashboardPages/manageProducts/ProductReview';
import ManageProducts from '../ecommerce/B2C/products/ManageProducts';
import ProductProfile from '../ecommerce/B2C/products/ProductProfile';
import Inventory from '../ecommerce/B2C/products/Inventory';
import ManageWareHouses from '../ecommerce/setting/ManageWareHouses';
import Currency from './pages/settings/Currency';
import Tax from './pages/settings/Tax';
import AllVendorProductB2C from './pages/dashboardPages/manageProducts/AllVendorProductB2C';
// Assuming you have or will create a VendorDashboard component (or reuse Customerdashboard for now)

const CmsRoutes = () => {
  const { user, permissions } = useSelector((state) => state.auth);
  const roleCode = user?.role?.code;

  const PrivateRoute = ({ children, allowedRoles, moduleName, permissionType }) => {
    // Check role
    if (!allowedRoles.includes(roleCode)) {
      return <Navigate to="/sawtar/cms" replace />;
    }
    // Check module permission
    if (moduleName && permissionType) {
      const hasPermission = permissions?.some(
        (perm) => perm.moduleId.name === moduleName && perm[permissionType] === 1
      );
      if (!hasPermission) {
        return <Navigate to="/sawtar/cms" replace />;
      }
    }
    return children;
  };

  // Component to redirect based on role to specific dashboard path
  const RoleBasedRedirect = () => {
    switch (roleCode) {
      case '0':
        return <Navigate to="/superadmin/dashboard" replace />;
      case '1':
        return <Navigate to="/admin/dashboard" replace />;
      case '2':
        return <Navigate to="/customer/dashboard" replace />;
      case '3':
        return <Navigate to="/employee/dashboard" replace />;
      case '6':
        return <Navigate to="/seller/b2b/dashboard" replace />;
        case '5':
        return <Navigate to="/seller/b2c/dashboard" replace />;
           case '8':
        return <Navigate to="/business/dashboard" replace />;
         case '7':
        return <Navigate to="/freelancer/dashboard" replace />;
      default:
        return <Navigate to="/sawtar/login" replace />;
    }
  };

  return (
    <Routes>
      {/* Base path redirect to role-specific dashboard */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Superadmin Dashboard (Role 0) */}
      <Route
        path="/superadmin/dashboard"
        element={
          <PrivateRoute allowedRoles={['0']}>
            <Dashboard /> {/* Or a specific SuperAdminDashboard if you create one */}
          </PrivateRoute>
        }
      />

      {/* Admin Dashboard (Role 1) */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['1']}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Employee Dashboard (Role 3) */}
      <Route
        path="/employee/dashboard"
        element={
          <PrivateRoute allowedRoles={['3']}>
            <Employeedashboard />
          </PrivateRoute>
        }
      />

      {/* Customer Dashboard (Role 2) */}
      <Route
        path="/customer/dashboard"
        element={
          <PrivateRoute allowedRoles={['2']}>
            <Customerdashboard />
          </PrivateRoute>
        }
      />
<Route
        path="/business/dashboard"
        element={
          <PrivateRoute allowedRoles={['8']}>
            <BusinessDashboard /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
      <Route
        path="/freelancer/dashboard"
        element={
          <PrivateRoute allowedRoles={['7']}>
            <BusinessDashboard /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
      {/* Vendor/Seller Dashboard (Role 4) */}
      <Route
        path="/seller/b2b/dashboard"
        element={
          <PrivateRoute allowedRoles={['6']}>
            <VendorDashboard /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
        <Route
        path="/seller/b2c/dashboard"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <VendorDashboard /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
      <Route
        path="/seller/b2b/myprofile"
        element={
          <PrivateRoute allowedRoles={['6']}>
            <MyProfileb2b /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
        <Route
        path="/seller/b2c/myprofile"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <MyProfileb2c /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
        <Route
        path="/seller/b2c/addproducts"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <AddProducts /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
       <Route
        path="/seller/b2c/products"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <ManageProducts /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
       <Route
        path="/seller/setting/warehouse"
        element={
          <PrivateRoute allowedRoles={['5','6']}>
            <ManageWareHouses /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
        <Route

        path="/seller/b2c/product/review/:id"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <ProductProfile /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
      <Route
        path="/seller/b2c/attributes"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <Attributes /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
       <Route
        path="/seller/b2c/attributes/add"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <AddAttributes /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
         <Route
        path="/seller/b2c/material/add"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <AddMaterial /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
       <Route
        path="/seller/b2c/brands/add"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <AddBrand /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
       <Route
        path="/admin/categories"
        element={
          <PrivateRoute allowedRoles={['0','1']}>
            <AddCategory /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
         <Route
        path="/admin/brands"
        element={
          <PrivateRoute allowedRoles={['0','1']}>
            <AddBrand /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
         <Route
        path="/admin/materials"
        element={
          <PrivateRoute allowedRoles={['0','1']}>
            <AddMaterial /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
         <Route
        path="/admin/product/seller"
        element={
          <PrivateRoute allowedRoles={['0','1']}>
            <AllVendorProductB2C /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
        <Route
        path="/vendor/b2c/product/request/:id"
        element={
          <PrivateRoute allowedRoles={['0']}>
            <ProductRequestB2C /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
      <Route
        path="/vendor/b2c/product/review/:id"
        element={
          <PrivateRoute allowedRoles={['0']}>
            <ProductReview /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
         <Route
        path="/seller/b2c/tags/add"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <AddTags /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
           <Route
        path="/seller/b2c/product/inventory/:id"
        element={
          <PrivateRoute allowedRoles={['5']}>
            <Inventory /> {/* Create VendorDashboard or replace with Customerdashboard */}
          </PrivateRoute>
        }
      />
        <Route
        path="/business/myprofile"
        element={
          <PrivateRoute allowedRoles={['8']} >
            <MyprofileBusiness />
          </PrivateRoute>
        }
      />
       <Route
        path="/freelancer/myprofile"
        element={
          <PrivateRoute allowedRoles={['7']} >
            <MyprofileFreelancer />
          </PrivateRoute>
        }
      />

      {/* Shared or role-specific routes - wrapped with PrivateRoute */}
      {/* Profile - assuming shared across all roles */}
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={['0', '1', '2', '3', '4']}>
            <Profile />
          </PrivateRoute>
        }
      />


      {/* Employee-specific routes (Role 3) */}
      <Route
        path="/dashboard" // Note: This was separate in original, keeping path as is
        element={
          <PrivateRoute allowedRoles={['3']}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/content">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['3']}>
              <ContentList />
            </PrivateRoute>
          }
        />
        <Route
          path="new"
          element={
            <PrivateRoute allowedRoles={['3']}>
              <ContentEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <PrivateRoute allowedRoles={['3']}>
              <ContentEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="categories"
          element={
            <PrivateRoute allowedRoles={['3']}>
              <div>Categories</div>
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/analytics">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['3']}>
              <Overview />
            </PrivateRoute>
          }
        />
        <Route
          path="reports"
          element={
            <PrivateRoute allowedRoles={['3']}>
              <Reports />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/settings">
        <Route
          path="profile"
          element={
            <PrivateRoute allowedRoles={['3']}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="system"
          element={
            <PrivateRoute allowedRoles={['3']}>
              <System />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Admin/Superadmin-specific routes (Roles 0 and 1) */}
      <Route
        path="/settings/permissions"
        element={
          <PrivateRoute allowedRoles={['0', '1']}>
            <Permission />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/roles"
        element={
          <PrivateRoute allowedRoles={['0', '1']}>
            <Role />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/modules"
        element={
          <PrivateRoute allowedRoles={['0', '1']}>
            <Modules />
          </PrivateRoute>
        }
      />
        <Route
        path="/settings/currency"
        element={
          <PrivateRoute allowedRoles={['0', '1']}>
            <Currency />
          </PrivateRoute>
        }
      />
        <Route
        path="/settings/tax"
        element={
          <PrivateRoute allowedRoles={['0', '1']}>
            <Tax />
          </PrivateRoute>
        }
      />

        <Route
        path="/freelancer/list"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Freelancer" permissionType="canView">
            <Freelancers />
          </PrivateRoute>
        }
      />
         <Route
        path="/freelancer/:id"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Freelancer" permissionType="canView">
            <FreelancerProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendors/b2c"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <VendorB2C />
          </PrivateRoute>
        }
      />
       <Route
        path="/vendors/b2b"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <VendorB2B />
          </PrivateRoute>
        }
      />
         <Route
        path="/business/request"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <BusinessRequest />
          </PrivateRoute>
        }
      />
       <Route
        path="/business/request/:id"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <BusinessProfile />
          </PrivateRoute>
        }
      />
         <Route
        path="/vendors/b2b/:id"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <VendorB2BProfile />
          </PrivateRoute>
        }
      />
          <Route
        path="/vendors/b2c/:id"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <VendorB2CProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendors/:id"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <VendorProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendors/pending"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Requests" permissionType="canView">
            <VendorRequest />
          </PrivateRoute>
        }
      />
     
      <Route
        path="/freelancer/request"
        element={
          <PrivateRoute allowedRoles={['0', '1']} moduleName="Freelancer" permissionType="canView">
            <Freelancerrequest />
          </PrivateRoute>
        }
      />
      {/* Content routes for admins - assuming shared with employee, but adjust allowedRoles if needed */}
      <Route path="/content">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <ContentList />
            </PrivateRoute>
          }
        />
        <Route
          path="new"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <ContentEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <ContentEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="categories"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Categories</div>
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/analytics">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <Overview />
            </PrivateRoute>
          }
        />
        <Route
          path="reports"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <Reports />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/settings">
        <Route
          path="profile"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="system"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <System />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/users">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <Admins />
            </PrivateRoute>
          }
        />
        <Route
          path="roles"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Roles</div>
            </PrivateRoute>
          }
        />
        <Route
          path="permissions"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Permissions</div>
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/ecommerce">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>E-Commerce Overview</div>
            </PrivateRoute>
          }
        />
        <Route
          path="products"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Products</div>
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Orders</div>
            </PrivateRoute>
          }
        />
        <Route
          path="customers"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Customers</div>
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/freelancers">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>All Freelancers</div>
            </PrivateRoute>
          }
        />
        <Route
          path="manage"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Manage</div>
            </PrivateRoute>
          }
        />
        <Route
          path="projects"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Projects</div>
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/ai-design">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>AI Design Dashboard</div>
            </PrivateRoute>
          }
        />
        <Route
          path="templates"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Templates</div>
            </PrivateRoute>
          }
        />
        <Route
          path="generator"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Generator</div>
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/social">
        <Route
          index
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Social Platforms</div>
            </PrivateRoute>
          }
        />
        <Route
          path="scheduler"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Scheduler</div>
            </PrivateRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <PrivateRoute allowedRoles={['0', '1']}>
              <div>Analytics</div>
            </PrivateRoute>
          }
        />
      </Route>

      {/* Fallback for invalid paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default CmsRoutes;