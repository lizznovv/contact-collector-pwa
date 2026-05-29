import { useEffect, useState } from 'react';
import { getLeads } from '../../services/leadService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LeadDashboard() {

    const [leads, setLeads] = useState([]);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadLeads();
    }, []);

    async function loadLeads() {
        try {
            const data = await getLeads();
            setLeads(data.leads);
        }
        catch (error) {
            console.error(error);
        }
    }

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <div>
            <h1>My Leads</h1>

            <button onClick={() => navigate('/leads')}>
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
                </tr>
                </thead>

                <tbody>
                {leads.map((lead) => (
                    <tr
                        key={lead.id}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>{lead.id}</td>
                        <td>{lead.full_name}</td>
                        <td>{lead.company}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default LeadDashboard;