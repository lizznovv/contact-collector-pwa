import api from '../api/axios';

export async function getLeads() {
    const response = await api.get('/leads');

    return response.data;
}

export async function getLead(id) {
    const response = await api.get(`/leads/${id}`);

    return response.data;
}

export async function createLead(data, idempotencyKey = null) {
    const config = {};
    if (idempotencyKey) {
        config.headers = {
            'Idempotency-Key': idempotencyKey
        };
    }
    // передаем данные и конфиг с заголовками
    const response = await api.post('/leads', data, config);
    return response.data;
}

export async function updateLead(id, data) {
    const response = await api.put(`/leads/${id}`, data);

    return response.data;
}
export async function syncLead(id) {
    const response = await api.post('/sync', {
        leads: [
            { id }
        ]
    });

    return response.data;
}