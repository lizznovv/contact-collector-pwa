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
        <div className="dashboard-container">
            <h1 className="page-title">
                Stream Contact
            </h1>

            <div className="dashboard-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/leads')}
                >
                    Leads
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/managers')}
                >
                    Managers
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/products')}
                >
                    Products
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/events')}
                >
                    Events
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
export default AdminDashboard;