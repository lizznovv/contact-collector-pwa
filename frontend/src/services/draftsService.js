import { dbPromise } from '../db/indexedDB';

export async function getAllDrafts() {
    const db = await dbPromise;

    return db.getAll('drafts');
}
export async function saveDraft(draft){
    const db = await dbPromise;

    return db.put('drafts', {
        ...draft,
        updatedAt: Date.now()
    });
}
export async function getDraftById(id) {
    const db = await dbPromise;

    return db.get('drafts', id);
}
export async function deleteDraft(id) {
    const db = await dbPromise;

    return db.delete('drafts', id);
}
export async function clearDrafts() {
    const db = await dbPromise;

    return db.clear('drafts');
}
export async function cleanupOldDrafts() {
    const db = await dbPromise;
    const drafts = await db.getAll('drafts');
    const sevenDaysAgo =
        Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const draft of drafts) {
        if (draft.updatedAt < sevenDaysAgo) {
            await db.delete('drafts', draft.id);
        }
    }
}
export async function runStorageCleanup() {
    await cleanupOldDrafts();
}
