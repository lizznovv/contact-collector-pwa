import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import UserDashboard from './pages/user/UserDashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/user" element={<UserDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;