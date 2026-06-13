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

            <div className="dashboard-actions dashboard-actions--admin">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/leads')}
                >
                    Заявки
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/managers')}
                >
                    Менеджеры
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/products')}
                >
                    Продукты
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/events')}
                >
                    Мероприятия
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}
export default AdminDashboard;