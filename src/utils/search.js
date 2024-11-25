import { initDB, STORE_NAME} from '../db/indexedDB';
import Fuse from 'fuse.js'

const normalizeString = (str) => {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();  // Trim and normalize spaces
};

let exactMatchSearch = (query, text) => {
    const normalizedQuery = normalizeString(query);
    const normalizedText = normalizeString(text);
    return normalizedText.toLowerCase().includes(normalizedQuery.toLowerCase());
}

let fuzzySearch = (query, data) => {
    console.log(data);
    const searchableData = data.pages.map((pageContent, index) => ({
        pdfId: data.pdfId,
        page: index + 1, // Add the page number for uniqueness
        content: pageContent
    }));
    const fuse = new Fuse(searchableData, {keys: ['content'], threshold: 0.3});
    return fuse.search(query);
}

export async function search(query, strategy) {
    const db = await initDB();
    const results = [];
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.store;

    let cursor = await store.openCursor();
    while (cursor) {
        const { pdfId, pages } = cursor.value;
                    // Choose a search strategy
        switch (strategy) {
            case 'exact':
                for (const [pageNum, text] of Object.entries(pages)) {
                    if(exactMatchSearch(query, text)) {
                    results.push({ pdfId, pageNum, snippet: text.slice(0, 100) });
                    }
                }
                break;
            case 'fuzzy':
                const fuzzyResults = fuzzySearch(query, cursor.value)
                console.log(cursor.value);
                console.log(fuzzyResults);
                break;
            default:
                throw new Error(`Unknown search strategy: ${strategy}`);
        }
        cursor = await cursor.continue();
    }
    return results;


}

export default search;
