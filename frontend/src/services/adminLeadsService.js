import api from '../api/axios';

export async function getLeads(filters = {}) {
    const response = await api.get('/admin/leads', {
        params: filters
    });

    return response.data.leads;
}