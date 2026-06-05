import api from '../api/axios';

export async function getLeads(filters = {}) {
    const response = await api.get('/admin/leads', {
        params: filters
    });

    return response.data.leads;
}
export async function exportLeads(filters = {}, format = 'xlsx') {
    const response = await api.get('/admin/export/leads', {
        params: {
            ...filters,
            format,
        },
        responseType: 'blob',
    });

    return response.data;
}