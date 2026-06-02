import { useEffect, useState } from 'react';
import { getLeads } from '../../services/leadService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllPendingLeads } from '../../services/pendingLeadsService';

function LeadDashboard() {

    const [leads, setLeads] = useState([]);
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

    return (
        <div>
            <h1>My Leads</h1>

            <button onClick={() => navigate('/leads/new')}>
                Create Lead
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default LeadDashboard;