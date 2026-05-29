import { dbPromise } from '../db/indexedDB';

const allowedStatuses = [
    'pending',
    'syncing',
    'synced',
    'error'
];
export async function addPendingLead(data) {
    const db = await dbPromise;

    return db.put('pending_leads', {
        ...data,
        syncStatus: 'pending',
        retryCount: 0,
        idempotencyKey: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
}
export async function getAllPendingLeads() {
    const db = await dbPromise;

    return db.getAll('pending_leads');
}
export async function getPendingLeadsForSync() {
    const db = await dbPromise;

    return db.getAllFromIndex(
        'pending_leads',
        'syncStatus',
        'pending'
    );
}
export async function updateLeadStatus(id, status) {
    const db = await dbPromise;
    const lead = await db.get('pending_leads', id);

    if (!lead) return;

    if (!allowedStatuses.includes(status)) {
        throw new Error('Invalid status');
    }

    lead.syncStatus = status;
    lead.updatedAt = Date.now();

    return db.put('pending_leads', lead);
}
export async function incrementRetry(id) {
    const db = await dbPromise;
    const lead = await db.get('pending_leads', id);

    if (!lead) return;

    lead.retryCount += 1;
    lead.syncStatus = 'pending';
    lead.updatedAt = Date.now();

    return db.put('pending_leads', lead);
}
export async function deletePendingLead(id) {
    const db = await dbPromise;

    return db.delete('pending_leads', id);
}