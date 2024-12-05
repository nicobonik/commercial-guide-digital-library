import Fuse from 'fuse.js';

let jsonData = null; // Variable to hold the parsed JSON data

const normalizeString = (str) => {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();  // Trim and normalize spaces
};

// Load the JSON file into memory
export const loadJSONData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load JSON file: ${response.statusText}`);
        }
        jsonData = await response.json();
        console.log('JSON data loaded:', jsonData);
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
};

// Search function
export const searchFromJSON = (query) => {
    query = query.trim().replace(/\s+/g, ' ').toLowerCase();  // Trim and normalize spaces
    if (!jsonData) {
        console.error('JSON data not loaded yet!');
        return [];
    }

    // Flatten the JSON structure for Fuse.js
    const data = jsonData.Pages.flatMap((entry) =>
        Object.entries(entry.pages).map(([pageNum, pageText]) => ({
            pdfId: entry.pdfId,
            pageNum,
            pageText: normalizeString(pageText),
        }))
    );

    const results = data.filter((item) => item.pageText.includes(normalizeString(query)));
    // Map results to include pdfId and page number
        return results.map(({ pdfId, pageNum, pageText }) => ({
            pdfId,
            pageNum,
        }));

        // Initialize Fuse.js
    // const fuse = new Fuse(data, {
    //     keys: ['pageText'], // Specify the key(s) to search
    //     threshold: 0.0, // Adjust for sensitivity (0 = exact match, 1 = very fuzzy)
    //     includeScore: true, // Optionally include the score for debugging
    //     isCaseSensitive: false, // Make the search case-insensitive
    //     useExtendedSearch: true
    // });

    // Perform the fuzzy search
    // const results = fuse.search(normalizeString(query));
    // console.log(results);

    // Return the matched items
    // return results.map(({ item }) => ({
    //     pdfId: item.pdfId,
    //     pageNum: item.pageNum,
    //     // pageText: item.pageText,
    // }));
            
};
