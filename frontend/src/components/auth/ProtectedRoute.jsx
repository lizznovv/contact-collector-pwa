import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const hasToken = localStorage.getItem('access_token');

    if (!isAuthenticated || !hasToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;