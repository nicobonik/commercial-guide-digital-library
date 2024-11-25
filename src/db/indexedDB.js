import { openDB } from 'idb';

export const DB_NAME = 'TextDB';
export const STORE_NAME = 'Pages';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'pdfId' });
        store.createIndex('pdfId', 'pdfId', { unique: true });
      }
    },
  });
}

export async function saveTextData(pdfId, pages) {
  const db = await initDB();
  await db.put(STORE_NAME, { pdfId, pages });
}

export async function getTextData(pdfId) {
  const db = await initDB();
  return db.get(STORE_NAME, pdfId);
}

// export async function searchText(query) {
//   const db = await initDB();
//   const results = [];
//   const tx = db.transaction(STORE_NAME, 'readonly');
//   const store = tx.store;

//   let cursor = await store.openCursor();
//   while (cursor) {
//     const { pdfId, pages } = cursor.value;
//     for (const [pageNum, text] of Object.entries(pages)) {
//       if (text.toLowerCase().includes(query.toLowerCase())) {
//         results.push({ pdfId, pageNum, snippet: text.slice(0, 100) });
//       }
//     }
//     cursor = await cursor.continue();
//   }
//   return results;
// }
