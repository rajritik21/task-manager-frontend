import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  // console.log('Token in PrivateRoute:', token); // Add this for debugging
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;