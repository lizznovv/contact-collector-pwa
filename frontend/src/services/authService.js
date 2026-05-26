import axios from 'axios';

export async function login(data) {
    return axios.post('/api/login', data);
}

export async function logout() {
    return axios.post('/api/logout');
}