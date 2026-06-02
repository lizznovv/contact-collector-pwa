import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import EventsTable from './pages/admin/events/EventsTable';
import EventForm from './pages/admin/events/EventForm';
import ProductsTable from './pages/admin/products/ProductsTable';
import ProductForm from './pages/admin/products/ProductForm';
import ManagersTable from './pages/admin/managers/ManagersTable';
import ManagerForm from './pages/admin/managers/ManagerForm';
import LeadsTable from './pages/admin/leads/LeadsTable';

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
                        path="/leads/new"
                        element={
                            <ProtectedRoute>
                                <LeadFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leads/:id"
                        element={
                            <ProtectedRoute>
                                <LeadFormPage   />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ProductsTable />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products/create"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <EventsTable />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events/create"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <EventForm/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <EventForm/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/managers"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManagersTable />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/managers/create"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManagerForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/managers/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManagerForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/leads"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <LeadsTable />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;