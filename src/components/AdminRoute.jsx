import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAILS } from '../constants/admins';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/admin-login" />;
  if (!ADMIN_EMAILS.includes(currentUser.email)) return <Navigate to="/login" />;

  return children;
};

export default AdminRoute;
