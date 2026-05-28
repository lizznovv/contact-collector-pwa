import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import UserDashboard from './pages/user/UserDashboard';
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<LoginPage />}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;