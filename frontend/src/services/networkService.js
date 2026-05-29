import api from '../api/axios';

export async function isServerAvailable() {
    try {
        await api.get('/health');

        return true;
    }
    catch {
        return false;
    }
}