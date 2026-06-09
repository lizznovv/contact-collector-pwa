import { openDB } from 'idb';

const DB_NAME = 'lead-manager-db'
const DB_VERSION = 1

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {

        //табл черновиков
        if (!db.objectStoreNames.contains('drafts')) {

            const draftsStore = db.createObjectStore('drafts', {
                keyPath: 'id'
            });

            draftsStore.createIndex('updatedAt', 'updatedAt');
        }

        //табл очереди отправки
        if (!db.objectStoreNames.contains('pending_leads')) {

            const pendingStore = db.createObjectStore('pending_leads', {
                keyPath: 'id',
                autoIncrement: true
            });

            pendingStore.createIndex('syncStatus', 'syncStatus');
            pendingStore.createIndex('createdAt', 'createdAt');
            pendingStore.createIndex('updatedAt', 'updatedAt');
        }

        //local events
        if (!db.objectStoreNames.contains('events')) {
            db.createObjectStore('events', {
                keyPath: 'id'
            });
        }
        //local products
        if (!db.objectStoreNames.contains('products')) {
            db.createObjectStore('products', {
                keyPath: 'id'
            });
        }
    }
});