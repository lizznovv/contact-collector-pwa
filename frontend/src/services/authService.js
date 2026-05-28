import api from '../api/axios';
import { clearDrafts } from './draftsService';

export async function login(credentials) {
    const response = await api.post('/login', credentials);
    const data = response.data;

    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
}

export async function logout() {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
        await api.post('/logout',{
            refresh_token: refreshToken,
        });
    }
    finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        clearDrafts();
    }
}