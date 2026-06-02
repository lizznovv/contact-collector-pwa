import api from '../api/axios';
import { clearDrafts } from './draftsService';

export async function login(credentials) {
    const response = await api.post('/login', credentials);
    const data = response.data;

    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
}

export async function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    clearDrafts();
    try {
        await api.post('/logout');
    }
    finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        clearDrafts();
    }
}