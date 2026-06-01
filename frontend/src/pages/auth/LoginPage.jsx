import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

function LoginPage() {
    const { login, isAuthenticated } = useAuth(); // берем функцию из контекста

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await login({ login: email, password });
            navigate('/dashboard');
        }
        catch (error) {
            if (!navigator.onLine) {
                alert('Нет соединения с интернетом. Вход невозможен.');
            } else if (error.code === 'ERR_NETWORK') {
                alert('Сервер недоступен. Проверьте, запущен ли бэкенд.');
            } else {
                alert(error.response?.data?.message || 'Ошибка входа');
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">
                Login
            </button>
        </form>
    );
}

export default LoginPage;