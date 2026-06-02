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
        <div>
            <h1>Events</h1>
            <button
                type="button"
                onClick={() => navigate('/admin')}
            >
                ← Главная
            </button>
            <button
                onClick={() => navigate('/admin/events/create')}
            >
                Add Event
            </button>

            <table>
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
                        key={event.id}
                        onClick={() =>
                            navigate(
                                `/admin/events/${event.id}/edit`
                            )
                        }
                    >
                        <td>{event.id}</td>
                        <td>{event.name}</td>
                        <td>{event.is_active ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}
export default EventsTable;