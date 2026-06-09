import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

function LoginPage() {
    const { login, isAuthenticated, user } = useAuth(); // берем функцию из контекста

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await login({ login: email, password });

            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
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
        <div className="login-screen">
            <div className="page-card login-card">
                <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Вход в систему
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label className="form-label">Пароль</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '14px' }}>
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;