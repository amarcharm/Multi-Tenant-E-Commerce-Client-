import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {

  const { user } = useSelector((state) => state.auth);

  // If not logged in at all → redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in but wrong role → redirect to home page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // All checks passed → show the page
  return children;
}