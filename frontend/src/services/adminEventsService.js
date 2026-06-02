import api from '../api/axios';

export async function getEvents() {
    const response = await api.get('/events');

    return response.data.events;
}

export async function getEvent(id) {
    const response = await api.get(`/events/${id}`);

    return response.data.event;
}

export async function createEvent(data) {
    return api.post('/events', data);
}

export async function updateEvent(id, data) {
    return api.put(`/events/${id}`, data);
}

export async function deleteEvent(id) {
    return api.delete(`/events/${id}`);
}