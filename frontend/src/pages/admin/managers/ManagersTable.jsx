import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManagers } from '../../../services/adminManagersService';

function ManagersTable() {

    const [managers, setManagers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadManagers();
    }, []);

    async function loadManagers() {
        const data = await getManagers();

        setManagers(data);
    }

    return (
        <div className="dashboard-container">
            <h1 className="page-title">
                Менеджеры
            </h1>

            <div className="dashboard-actions">
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => navigate('/admin')}
                >
                    ← Главная
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/managers/create')}
                >
                    Добавить менеджеры
                </button>
            </div>

            <div className="table-wrapper">

                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Телефон</th>

                        </tr>
                    </thead>

                    <tbody>
                    {managers.map(manager => (
                        <tr
                            className="table-row-clickable"
                            key={manager.id}
                            onClick={() =>
                                navigate(`/admin/managers/${manager.id}/edit`)}
                        >
                            <td data-label="ID">{manager.id}</td>
                            <td data-label="Имя">{manager.name}</td>
                            <td data-label="Email">{manager.email}</td>
                            <td data-label="Телефон">{manager.phone}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManagersTable;