import { useAuthStore } from '@/store/slices/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    // If there is no token, redirect to the /login page
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;