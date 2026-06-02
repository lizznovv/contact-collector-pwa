import {
    getPendingLeadsForSync,
    updateLeadStatus,
    deletePendingLead,
    incrementRetry
} from './pendingLeadsService';
import { createLead, syncLead } from './leadService';

let isSyncing = false;

export async function syncSingleLead(lead){

    if (lead.retryCount >= 5) {
        await updateLeadStatus(lead.id, 'error');
        return;
    }

    try {
        await updateLeadStatus(lead.id, 'syncing');
        const payload = { ...lead };
        delete payload.syncStatus;
        delete payload.retryCount;
        delete payload.updatedAt;
        delete payload.createdAt;

        const result = await createLead(payload, lead.idempotencyKey);

        await syncLead(result.id);
        await deletePendingLead(lead.id);

        console.log(`Lead ${lead.id} synced`);
    }
    catch (error) {
        console.log(error.response?.data);

        if (error.response && error.response.status === 409) {
            console.warn(`Lead ${lead.id} already exists on server, removing from queue`);
            await deletePendingLead(lead.id);
            return;
        }
        if (error.response && error.response.status === 400) {
            console.error('Validation error, sync stopped for this lead', error.response.data);
            await updateLeadStatus(lead.id, 'error');
            return;
        }

        console.error(`Lead ${lead.id} sync failed`, error);

        await incrementRetry(lead.id);

    }
}

export async function syncPendingLeads() {

    if (isSyncing) return;
    isSyncing = true;

    try {
        const leads = await getPendingLeadsForSync();
        console.log('Starting sync...');
        console.log(`Found ${leads.length} leads to sync`);

        for (const lead of leads) {
            await syncSingleLead(lead);
        }
    }
    finally {
        isSyncing = false;
    }
}