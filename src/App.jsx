import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateStore from './pages/vendor/CreateStore';
import ProtectedRoute from './routes/ProtectedRoute';
import AddProduct from './pages/vendor/AddProduct';
import MyProducts from './pages/vendor/MyProducts';
import Products     from './pages/Products';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['vendor', 'superadmin']}>
            <VendorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/create-store"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <CreateStore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/add-product"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <AddProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor/products"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <MyProducts />
          </ProtectedRoute>
        }
        />

      <Route path="/products"     element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />

    </Routes>
  );
}