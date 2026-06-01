import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import LeadDashboard from './pages/lead/LeadDashboard';
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import LeadFormPage from './pages/lead/LeadFormPage';
import { useEffect } from 'react';
import { syncPendingLeads } from './services/syncService';
import { isServerAvailable } from './services/networkService';
import { syncReferenceData } from './services/referenceDataService';

function App() {

    useEffect(() => {
        async function trySync() {

            const token = localStorage.getItem('access_token');
            if (!token) return;

            const available = await isServerAvailable();

            if (available) {
                await syncReferenceData();
                await syncPendingLeads();
            }
        }

        if (navigator.onLine) trySync();
        window.addEventListener('online', trySync);

        return () => {
            window.removeEventListener('online', trySync);
        };
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<LoginPage />
                    }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <LeadDashboard  />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={<LoginPage />
                    }
                    />
                    <Route
                        path="/leads"
                        element={<LeadFormPage />}
                    />
                    <Route
                        path="/leads/:id"
                        element={
                            <ProtectedRoute>
                                <LeadFormPage   />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;