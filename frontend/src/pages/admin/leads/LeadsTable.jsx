import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads } from '../../../services/adminLeadsService';
import { getManagers } from '../../../services/adminManagersService';
import { getEvents } from '../../../services/adminEventsService';
import { getProducts } from '../../../services/adminProductsService';
function LeadsTable() {

    const [leads, setLeads] = useState([]);
    const navigate = useNavigate();
    const [managers, setManagers] = useState([]);
    const [events, setEvents] = useState([]);
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        manager_id: '',
        event_id: '',
        product_id: '',
        date_from: '',
        date_to: '',
    });

    useEffect(() => {
        loadLeads();
        loadFiltersData();
    }, []);

    async function loadLeads() {
        console.log('FILTERS:', filters);
        const data = await getLeads(filters);
        setLeads(data);
    }

    async function loadFiltersData() {
        try {
            const managersData = await getManagers();
            const eventsData = await getEvents();
            const productsData = await getProducts();

            setManagers(managersData);
            setEvents(eventsData);
            setProducts(productsData);
        }
        catch (error) {
            console.error(error);
        }
    }
    function handleFilterChange(event) {
        const { name, value } = event.target;

        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    return(
        <div>

            <h1>Лиды</h1>
            <button
                type="button"
                onClick={() => navigate('/admin')}
            >
                ← Главная
            </button>
            <div>
                <select
                    name="manager_id"
                    value={filters.manager_id}
                    onChange={handleFilterChange}
                >
                    <option value="">Все менеджеры</option>

                    {managers.map(manager => (
                        <option key={manager.id} value={manager.id} >
                            {manager.name}
                        </option>
                    ))}
                </select>

                <select
                    name="event_id"
                    value={filters.event_id}
                    onChange={handleFilterChange}
                >
                    <option value="">Все события</option>

                    {events.map(event => (
                        <option key={event.id} value={event.id} >
                            {event.name}
                        </option>
                    ))}
                </select>

                <select
                    name="product_id"
                    value={filters.product_id}
                    onChange={handleFilterChange}
                >
                    <option value="">Все продукты</option>

                    {products.map(product => (
                        <option key={product.id} value={product.id} >
                            {product.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    name="date_from"
                    value={filters.date_from}
                    onChange={handleFilterChange}
                />

                <input
                    type="date"
                    name="date_to"
                    value={filters.date_to}
                    onChange={handleFilterChange}
                />

                <button onClick={loadLeads}>
                    Применить
                </button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Телефон</th>
                    <th>Email</th>
                    <th>Менеджер</th>
                    <th>Событие</th>
                    <th>Дата</th>
                </tr>
                </thead>

                <tbody>
                {leads.map(lead => (
                    <tr key={lead.id}>
                        <td>{lead.id}</td>
                        <td>{lead.full_name}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.email}</td>
                        <td>{lead.user?.name}</td>
                        <td>{lead.event?.name}</td>
                        <td>{lead.created_at}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default LeadsTable;