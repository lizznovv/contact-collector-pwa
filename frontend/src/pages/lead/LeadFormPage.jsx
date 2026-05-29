import api from '../../api/axios';

function LeadFormPage() {

    async function testAuth() {

        try {
            const response = await api.get('/user');
            console.log(response.data);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div>

            <h1>Dashboard</h1>

            <button onClick={testAuth}>
                Test Auth
            </button>

        </div>
    );
}

export default UserDashboard;