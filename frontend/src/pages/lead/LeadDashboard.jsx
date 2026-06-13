import { useEffect, useState } from 'react';
import { getLeads } from '../../services/leadService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllPendingLeads, resetRetry } from '../../services/pendingLeadsService';
import { syncSingleLead } from '../../services/syncService';
import DraftsModal from './DraftModal';
import { getAllDrafts, deleteDraft, clearDrafts } from '../../services/draftsService';


function LeadDashboard() {

    const [leads, setLeads] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        loadLeads();
    }, []);

    useEffect(() => {

        function handleOnline() {
            setIsOnline(true);
        }

        function handleOffline() {
            setIsOnline(false);
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };

    }, []);

    async function loadLeads() {
        const localLeads = await getAllPendingLeads();
        const normalizedLocalLeads = localLeads.map(lead => ({
            ...lead,
            status: lead.syncStatus,
            source: 'local'
        }));

        const draftList = await getAllDrafts();

        draftList.sort(
            (a, b) => b.updatedAt - a.updatedAt
        );

        setDrafts(draftList);

        try {
            const data = await getLeads();
            const normalizedServerLeads = data.leads.map(lead => ({
                ...lead,
                source: 'server'
            }));

            setLeads([
                ...normalizedServerLeads,
                ...normalizedLocalLeads
            ]);
        }
        catch (error) {
            console.error('Server unavailable:', error);
            setLeads(normalizedLocalLeads);
        }
    }

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    async function handleRetry(lead) {
        await resetRetry(lead.id);
        await syncSingleLead(lead, true);
        await loadLeads();
    }

    async function handleDeleteDraft(id) {
        await deleteDraft(id);
        await loadLeads();
    }

    async function handleDeleteAllDrafts() {
        await clearDrafts();
        await loadLeads();
    }

    function handleOpenDraft(draft) {
        setShowDrafts(false);
        navigate('/leads/new', { state: { draft } });
    }

    return (
        <div className="dashboard-container">
            <div
                className={
                    isOnline
                        ? 'connection-status online'
                        : 'connection-status offline'
                }
            >
                {isOnline
                    ? '🟢 Онлайн'
                    : '🔴 Оффлайн'}
            </div>

            <h1 className="page-title">
                Мои заявки
            </h1>

            <div className="dashboard-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/leads/new')}
                >
                    Создать заявку
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() => setShowDrafts(true)}
                >
                    Черновики {drafts.length > 0 && `(${drafts.length})`}
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    Выйти
                </button>
            </div>

            <div className="table-wrapper">

                <table className="table leads-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Компания</th>
                        <th>Статус</th>
                    </tr>
                    </thead>

                    <tbody>
                    {leads.map((lead) => (
                        <tr
                            className="table-row-clickable"
                            key={`${lead.source}-${lead.id}`}
                            onClick={() => navigate(`/leads/${lead.id}`)}
                        >
                            <td data-label="ID">{lead.id}</td>
                            <td data-label="Имя">{lead.full_name}</td>
                            <td data-label="Компания">{lead.company}</td>
                            <td data-label="Статус" className="status-cell">
                                <span className="status-text">{lead.status}</span>
                                {lead.status === 'error' && (
                                    <button
                                        className="btn btn-primary btn-retry-overlay"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleRetry(lead);
                                        }}
                                    >
                                        Повторить
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showDrafts && (
                <DraftsModal
                    drafts={drafts}
                    onClose={() => setShowDrafts(false)}
                    onOpen={handleOpenDraft}
                    onDelete={handleDeleteDraft}
                    onDeleteAll={handleDeleteAllDrafts}
                />
            )}
        </div>
    );
}

export default LeadDashboard;