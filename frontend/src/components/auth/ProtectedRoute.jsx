import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {

    const { isAuthenticated, user } = useAuth();
    const hasToken = localStorage.getItem('access_token');

    if (!isAuthenticated || !hasToken){
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />    }

    return children;
}

export default ProtectedRoute;