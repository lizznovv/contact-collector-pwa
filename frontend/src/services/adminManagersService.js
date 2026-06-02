import api from '../api/axios';

export async function getManagers() {
    const response = await api.get('/managers');

    return response.data.managers;
}

export async function getManager(id) {
    const response = await api.get(`/managers/${id}`);

    return response.data.manager;
}

export async function createManager(data) {
    const response = await api.post('/managers', data);

    return response.data;
}

export async function updateManager(id, data) {
    const response = await api.put(`/managers/${id}`, data);

    return response.data;
}

export async function deleteManager(id) {
    const response = await api.delete(`/managers/${id}`);

    return response.data;
}