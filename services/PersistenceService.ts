/**
 * SIGNET PERSISTENCE SERVICE
 * Handles local-only storage of identity seeds using IndexedDB.
 */

const DB_NAME = 'SignetProtocol_v1';
const STORE_NAME = 'IdentityVault';
const PREFS_STORE = 'Preferences';

export interface VaultRecord {
  anchor: string;
  identity: string;
  publicKey: string;
  mnemonic: string;
  timestamp: number;
  type: 'SOVEREIGN' | 'CONSUMER';
  provider?: string;
  verificationSource?: string;
}

export const PersistenceService = {
  init: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'anchor' });
        }
        if (!db.objectStoreNames.contains(PREFS_STORE)) {
          db.createObjectStore(PREFS_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  saveVault: async (record: VaultRecord): Promise<void> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  getAllVaults: async (): Promise<VaultRecord[]> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  getActiveVault: async (): Promise<VaultRecord | null> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PREFS_STORE, STORE_NAME], 'readonly');
      const prefs = transaction.objectStore(PREFS_STORE);
      const getActive = prefs.get('active_anchor');
      
      getActive.onsuccess = async () => {
        const anchor = getActive.result;
        if (!anchor) {
          const all = await PersistenceService.getAllVaults();
          resolve(all[0] || null);
          return;
        }
        const store = transaction.objectStore(STORE_NAME);
        const getVault = store.get(anchor);
        getVault.onsuccess = () => resolve(getVault.result || null);
      };
      getActive.onerror = () => reject(getActive.error);
    });
  },

  setActiveVault: async (anchor: string): Promise<void> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PREFS_STORE, 'readwrite');
      const store = transaction.objectStore(PREFS_STORE);
      const request = store.put(anchor, 'active_anchor');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  purgeVault: async (anchor: string): Promise<void> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(anchor);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};