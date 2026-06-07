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

    useEffect(() => {
        loadLeads();
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
        <div>
            <h1>My Leads</h1>

            <button onClick={() => navigate('/leads/new')}>
                Create Lead
            </button>
            <button onClick={() => setShowDrafts(true)}>
                Черновики {drafts.length > 0 && `(${drafts.length})`}
            </button>
            <button onClick={handleLogout}>
                Logout
            </button>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {leads.map((lead) => (
                    <tr
                        key={`${lead.source}-${lead.id}`}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>{lead.id}</td>
                        <td>{lead.full_name}</td>
                        <td>{lead.company}</td>
                        <td>{lead.status}</td>
                        <td>
                            {lead.status === 'error' && (
                                <button
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