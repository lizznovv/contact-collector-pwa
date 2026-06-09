import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads, exportLeads } from '../../../services/adminLeadsService';
import { getManagers } from '../../../services/adminManagersService';
import { getEvents } from '../../../services/adminEventsService';
import { getProducts } from '../../../services/adminProductsService';
function LeadsTable() {

    const [leads, setLeads] = useState([]);
    const navigate = useNavigate();
    const [managers, setManagers] = useState([]);
    const [events, setEvents] = useState([]);
    const [products, setProducts] = useState([]);
    const [exportFormat, setExportFormat] = useState('xlsx');

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
        const {name, value} = event.target;
        const today = new Date().toISOString().split('T')[0];

        const newFilters = {
            ...filters,
            [name]: value,
        };

        if (newFilters.date_from && newFilters.date_to && (newFilters.date_from > newFilters.date_to)) {
            alert('Дата "От" не может быть больше даты "До"');
            return;
        }

        setFilters(newFilters);
    }
    async function handleExport() {
        try {
            const blob = await exportLeads(filters, exportFormat);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download =
                exportFormat === 'csv'
                    ? 'leads.csv'
                    : 'leads.xlsx';

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error(error);
            alert('Ошибка экспорта');
        }
    }

    return(
        <div className="dashboard-container">
            <h1 className="page-title">
                Leads
            </h1>
            <p className="table-info">
                Найдено лидов: {leads.length}
            </p>

            <div className="dashboard-actions">
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => navigate('/admin')}
                >
                    ← Главная
                </button>
            </div>

            <div className="page-card">
                <div className="filters-panel">
                    <h3 className="section-title">
                        Фильтры
                    </h3>

                    <select
                        className="form-select filter-control"
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
                        className="form-select filter-control"
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
                        className="form-select filter-control"
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
                        className="form-input filter-control"
                        type="date"
                        name="date_from"
                        value={filters.date_from}
                        onChange={handleFilterChange}
                    />

                    <input
                        className="form-input filter-control"
                        type="date"
                        name="date_to"
                        value={filters.date_to}
                        onChange={handleFilterChange}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={loadLeads}
                    >
                        Применить
                    </button>

                    <select
                        className="form-select filter-control"
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                    >
                        <option value="xlsx">Excel (.xlsx)</option>
                        <option value="csv">CSV (.csv)</option>
                    </select>

                    <button
                        className="btn btn-secondary"
                        onClick={handleExport}
                    >
                        Экспортировать
                    </button>
                </div>
            </div>

            <div className="table-wrapper">

                <table className="table">
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
                    {leads.length === 0 ? (
                        <tr>
                            <td colSpan="7">
                                Лиды не найдены
                            </td>
                        </tr>
                    ) : (
                        leads.map(lead => (
                            <tr
                                key={lead.id}
                            >
                                <td data-label="ID">{lead.id}</td>
                                <td data-label="ФИО">{lead.full_name}</td>
                                <td data-label="Телефон">{lead.phone}</td>
                                <td data-label="Email">{lead.email}</td>
                                <td data-label="Менеджер">{lead.user?.name}</td>
                                <td data-label="Событие">{lead.event?.name}</td>
                                <td data-label="Дата">
                                    <span>
                                        {lead.event?.event_date}
                                        {lead.event?.end_date && ` — ${lead.event.end_date}`}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default LeadsTable;