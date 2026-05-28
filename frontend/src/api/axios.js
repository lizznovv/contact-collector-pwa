import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost/api',
    // withCredentials: true,
});


// перехватчик запросов: добавляет Access Token в заголовки
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// перехватчик ответов: обрабатывает 401 ошибку
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // проверка что ошибка 401 и мы еще не пытались обновить токен (_retry)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');

                // запрос на обновление токена
                const response = await axios.post('https://localhost/api/refresh', {
                    refresh_token: refreshToken
                });

                const newAccessToken = response.data.access_token;
                const newRefreshToken = response.data.refresh_token;

                // Сохраняем новые токены
                localStorage.setItem('access_token', newAccessToken);
                localStorage.setItem('refresh_token', newRefreshToken);

                // обновляем заголовок в упавшем запросе и повторяем его
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);

            }
            catch (refreshError) {
                // если даже refresh token не сработал — разлогиниваем
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');

                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;