import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateStore from './pages/vendor/CreateStore';
import ProtectedRoute from './routes/ProtectedRoute';

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

    </Routes>
  );
}