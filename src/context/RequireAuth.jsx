import { useAuth } from './AuthContext';
import { Navigate, useLocation } from 'react-router';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
  
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;
