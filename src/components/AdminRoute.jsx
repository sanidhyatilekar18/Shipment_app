import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAILS } from '../constants/admins';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (!ADMIN_EMAILS.includes(currentUser.email)) return <Navigate to="/dashboard" />;

  return children;
};

export default AdminRoute;
