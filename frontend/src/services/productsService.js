import { dbPromise } from '../db/indexedDB';

export async function saveProducts(products) {
    const db = await dbPromise;
    const tx = db.transaction('products', 'readwrite');

    await tx.store.clear();

    for (const product of products) {
        await tx.store.put(product);
    }

    await tx.done;
}

export async function getCachedProducts() {
    const db = await dbPromise;

    return db.getAll('products');
}