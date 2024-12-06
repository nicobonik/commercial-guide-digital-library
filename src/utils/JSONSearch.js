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
export const searchFromJSON = (query, isExactSearch) => {
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
    let results = []
    console.log(isExactSearch)
    if (isExactSearch) {
        results = data.filter((item) => item.pageText.includes(normalizeString(query)));
    }
    else {
         results = data.filter((item) => {
            const words = item.pageText.split(/\s+/); // Split pageText into words
            const queryNormalized = normalizeString(query);
            return words.some(word => calculateSimilarity(word, queryNormalized) > 0.8);
        });
    }
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


function calculateSimilarity(str1, str2) {
    const commonSubsequenceLength = (s1, s2) => {
        let longest = 0;
        let start1 = 0, start2 = 0;
        let length = 0;

        for (let i = 0; i < s1.length; i++) {
            for (let j = 0; j < s2.length; j++) {
                length = 0;
                while (s1[i + length] === s2[j + length] && i + length < s1.length && j + length < s2.length) {
                    length++;
                }
                if (length > longest) {
                    longest = length;
                    start1 = i;
                    start2 = j;
                }
            }
        }
        return { length: longest, start1, start2 };
    };

    if (!str1 || !str2) return 0;

    let totalLength = str1.length + str2.length;
    let similarity = 0;

    while (str1.length > 0 && str2.length > 0) {
        const { length, start1, start2 } = commonSubsequenceLength(str1, str2);
        if (length === 0) break;

        similarity += length * 2;
        str1 = str1.slice(0, start1) + str1.slice(start1 + length);
        str2 = str2.slice(0, start2) + str2.slice(start2 + length);
    }

    return similarity / totalLength;
}