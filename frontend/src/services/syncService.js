import { createLead } from './leadService';
import {
    getPendingLeadsForSync,
    updateLeadStatus,
    deletePendingLead,
    incrementRetry
} from './pendingLeadsService';

let isSyncing = false;
export async function syncPendingLeads() {

    if (isSyncing) {
        return;
    }
    isSyncing = true;

    try {
        const leads = await getPendingLeadsForSync();
        console.log('Starting sync...');
        console.log(`Found ${leads.length} leads to sync`);

        for (const lead of leads) {

            if (lead.retryCount >= 5) {
                await updateLeadStatus(lead.id, 'error');
                continue;
            }

            try {
                await updateLeadStatus(lead.id, 'syncing');
                await createLead(lead);
                await deletePendingLead(lead.id);

                console.log(`Lead ${lead.id} synced`);
            }
            catch (error) {

                console.error(
                    `Lead ${lead.id} sync failed`,
                    error
                );

                await incrementRetry(lead.id);
                await updateLeadStatus(
                    lead.id,
                    'pending'
                );
            }
        }
    }
    finally {
        isSyncing = false;
    }
}