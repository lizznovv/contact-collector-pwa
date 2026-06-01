import api from '../api/axios';
import { dbPromise } from '../db/indexedDB';

export async function syncReferenceData() {
    try {
        const db = await dbPromise;

        const [eventsRes, productsRes] = await Promise.all([
            api.get('/events'),
            api.get('/products')
        ]);

        let events = [];
        let products = [];

        if (Array.isArray(eventsRes.data?.events)) {
            events = eventsRes.data.events;
        }

        if (Array.isArray(productsRes.data?.products)) {
            products = productsRes.data.products;
        }

        const tx = db.transaction(
            ['events', 'products'],
            'readwrite'
        );

        await tx.objectStore('events').clear();
        await tx.objectStore('products').clear();

        for (const event of events) {
            await tx.objectStore('events').put(event);
        }

        for (const product of products) {
            await tx.objectStore('products').put(product);
        }

        await tx.done;
        console.log('Справочники успешно обновлены в IndexedDB');
    }
    catch (error) {
        console.error('Ошибка при синхронизации справочников:', error);

        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
    }
}

export async function getCachedEvents() {
    const db = await dbPromise;
    const data = await db.getAll('events');

    return Array.isArray(data) ? data : [];
}

export async function getCachedProducts() {
    const db = await dbPromise;
    const data = await db.getAll('products');

    return Array.isArray(data) ? data : [];
}