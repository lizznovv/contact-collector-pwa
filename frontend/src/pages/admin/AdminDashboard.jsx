import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
    const { logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    const navigate = useNavigate();

    return (
        <div className="dashboard-grid">
            <h1>Stream Contact</h1>

            <button onClick={() => navigate('/admin/leads')}>
                Leads
            </button>

            <button onClick={() => navigate('/admin/managers')}>
                Managers
            </button>

            <button onClick={() => navigate('/admin/products')}>
                Products
            </button>

            <button onClick={() => navigate('/admin/events')}>
                Events
            </button>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
export default AdminDashboard;