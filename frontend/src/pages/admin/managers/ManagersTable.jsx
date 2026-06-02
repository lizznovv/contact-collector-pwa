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
        <div>
            <h1>Managers</h1>
            <button
                type="button"
                onClick={() => navigate('/admin')}
            >
                ← Главная
            </button>
            <button
                onClick={() => navigate('/admin/managers/create')}
            >
                Add Manager
            </button>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Телефон</th>

                </tr>
                </thead>

                <tbody>
                {managers.map(manager => (
                    <tr
                        key={manager.id}
                        onClick={() =>
                            navigate(
                                `/admin/managers/${manager.id}/edit`
                            )
                        }
                    >
                        <td>{manager.id}</td>
                        <td>{manager.name}</td>
                        <td>{manager.email}</td>
                        <td>{manager.phone}</td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManagersTable;