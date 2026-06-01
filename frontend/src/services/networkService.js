import axios from 'axios';

export async function isServerAvailable() {
    try {
        await axios.get('/api/health');

        return true;
    }
    catch {
        return false;
    }
}