import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getEvents} from "../../../services/adminEventsService.js";

function EventsTable() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        const data = await getEvents();

        setEvents(data);
    }

    return (
        <div className="dashboard-container">
            <h1 className="page-title">
                Events
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
                    onClick={() => navigate('/admin/events/create')}
                >
                    Add Event
                </button>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Active</th>
                    </tr>
                    </thead>

                    <tbody>
                    {events.map(event => (
                        <tr
                            className="table-row-clickable"
                            key={event.id}
                            onClick={() =>
                                navigate(`/admin/events/${event.id}/edit`)}
                        >
                            <td data-label="ID">{event.id}</td>
                            <td data-label="Name">{event.name}</td>
                            <td data-label="Active">{event.is_active ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
export default EventsTable;