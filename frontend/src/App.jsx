import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import LeadDashboard from './pages/lead/LeadDashboard';
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import LeadFormPage from "./pages/lead/LeadFormPage.jsx";

import LeadFormPage from './pages/lead/LeadFormPage';
import { useEffect } from 'react';
import { syncPendingLeads } from './services/syncService';
import { isServerAvailable } from './services/networkService';
import { addPendingLead } from './services/pendingLeadsService';
function App() {

    useEffect(() => {
/*
        async function createTestLead() {

            await addPendingLead({
                full_name: 'Test User',
                phone: '+79999999999',
                email: 'test@test.com',
                company: 'Test Company',
                position: 'Developer',
                event_id: 1
            });
            console.log('Test lead created');
        }

        createTestLead();
*/
        async function trySync() {

            const available = await isServerAvailable();
            if (available) {
                await syncPendingLeads();
            }
        }

        trySync();

        window.addEventListener(
            'online',
            trySync
        );

        return () => {
            window.removeEventListener(
                'online',
                trySync
            );
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