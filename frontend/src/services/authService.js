import api from '../api/axios';
import { clearDrafts } from './draftsService';

export async function login(data) {
    return api.post('/login', data);
}

export async function logout() {
    await api.post('/logout');
    await clearDrafts();
}