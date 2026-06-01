import { dbPromise } from '../db/indexedDB';

export async function saveEvents(events) {
    const db = await dbPromise;
    const tx = db.transaction('events', 'readwrite');

    await tx.store.clear();

    for (const event of events) {
        await tx.store.put(event);
    }

    await tx.done;
}

export async function getCachedEvents() {
    const db = await dbPromise;

    return db.getAll('events');
}