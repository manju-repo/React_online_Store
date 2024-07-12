import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/auth-context';

const ProtectedRoute = ({ element, requiredRole }) => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  const location = useLocation();
console.log(isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/user?mode=login" state={{ from: location }} />;
  }

  if (requiredRole && requiredRole === 'admin' && !isAdmin) {
    throw { status: 403, message: 'Unauthorized' }; // Throwing an error for unauthorized access
  }

  return element;
};

export default ProtectedRoute;
