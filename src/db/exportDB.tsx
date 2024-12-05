import { initDB, STORE_NAME} from './indexedDB';

const exportIndexedDBToJSON = async (dbName: string, storeName: string) => {
    return new Promise<object>((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
            const db = request.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);

            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                const data = getAllRequest.result;
                resolve({ [storeName]: data }); // Wrap the data in a JSON object
            };

            getAllRequest.onerror = () => {
                reject(getAllRequest.error);
            };
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

const downloadIndexedDBAsJSON = async (dbName: string, storeName: string) => {
    try {
        const data = await exportIndexedDBToJSON(dbName, storeName);
        const jsonData = JSON.stringify(data, null, 2); // Pretty print

        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${dbName}-${storeName}.json`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting IndexedDB data:', error);
    }
};

export default downloadIndexedDBAsJSON;