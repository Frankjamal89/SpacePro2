/**
 * Extremely lightweight utility for storing large assets (like custom uploaded MP4 videos)
 * in IndexedDB to avoid standard browser localStorage QuotaExceededError (5MB limit).
 */

export function saveLargeAsset(key: string, value: string): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.open('spacepro_assets_db', 1);
    request.onupgradeneeded = () => {
      try {
        request.result.createObjectStore('assets');
      } catch (e) {
        console.error("Failed to create object store", e);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      try {
        const tx = db.transaction('assets', 'readwrite');
        const store = tx.objectStore('assets');
        store.put(value, key);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          resolve();
        };
      } catch (e) {
        console.error("IndexedDB transaction error", e);
        db.close();
        resolve();
      }
    };
    request.onerror = () => {
      resolve();
    };
  });
}

export function getLargeAsset(key: string): Promise<string | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open('spacepro_assets_db', 1);
    request.onupgradeneeded = () => {
      try {
        request.result.createObjectStore('assets');
      } catch (e) {
        console.error("Failed to create object store on upgrade", e);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      try {
        const tx = db.transaction('assets', 'readonly');
        const store = tx.objectStore('assets');
        const req = store.get(key);
        req.onsuccess = () => {
          db.close();
          resolve(req.result || null);
        };
        req.onerror = () => {
          db.close();
          resolve(null);
        };
      } catch (e) {
        db.close();
        resolve(null);
      }
    };
    request.onerror = () => {
      resolve(null);
    };
  });
}

export function removeLargeAsset(key: string): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.open('spacepro_assets_db', 1);
    request.onsuccess = () => {
      const db = request.result;
      try {
        const tx = db.transaction('assets', 'readwrite');
        const store = tx.objectStore('assets');
        store.delete(key);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          resolve();
        };
      } catch (e) {
        db.close();
        resolve();
      }
    };
    request.onerror = () => {
      resolve();
    };
  });
}
