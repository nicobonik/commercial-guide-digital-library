
let jsonData = null; // Variable to hold the parsed JSON data

const normalizeString = (str) => {
    return str
        .toLowerCase() // Convert to lowercase
        .replace(/\./g, '') // Remove periods
        .replace(/[\s]+/g, ' ') // Replace multiple spaces with a single space
        .trim(); // Remove leading and trailing whitespace
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
export const searchFromJSON = async (query, isExactSearch) => {
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
        results = data.filter((item) => {
            const normalizedQuery = query;
            const words = item.pageText.split(/\s+/); // Split normalized pageText into words
            const queryWords = normalizedQuery.split(/\s+/); // Split normalized query into words

            // Find if the query exists in the normalized pageText
            const queryMatched = item.pageText.includes(normalizedQuery);
            if (!queryMatched) {
                return false;
            }

            // Find the starting index of the query in the word list
            const queryLength = queryWords.length;
            for (let i = 0; i <= words.length - queryLength; i++) {
                const slice = words.slice(i, i + queryLength).join(" ");
                if (slice === normalizedQuery) {
                    // Store the starting index
                    item.index = i; // Attach index to the item
                    return true; // Keep this item in the filtered results
                }
            }

            return false; // Query not found
        });
       
        return results.map(({ pdfId, pageNum, pageText, index }) => ({
            pdfId,
            pageNum,
            index,
        }));
    }
    else {
        let queryIndices = [];
        results = data.filter((item) => {
            const words = item.pageText.split(/\s+/); // Split pageText into words
            const queryWords = normalizeString(query).split(/\s+/); // Split query into words and normalize
            const phraseMatched = areWordsClose(queryWords, words, 3);
            if(phraseMatched !== false) {
                // console.log(phraseMatched.index);
                queryIndices.push(phraseMatched.index);
                return true;
            }
            return false;
            // return queryWords.every(queryWord => 
            //     words.some(word => {
            //         const similarity = calculateSimilarity(word, queryWord);
            //         if (similarity > 0.8) {
            //             console.log(word + ", " + similarity);
            //         }
            //         return similarity > 0.8;
            //     })
            // );
        });
        // console.log(queryIndices);
        const resultsWithoutText = results.map(({ pdfId, pageNum, pageText }) => ({
            pdfId,
            pageNum,
        }));
        resultsWithoutText.forEach((item, index) => {
            item["index"] = queryIndices[index];
        })
        return resultsWithoutText;
    }
        

};

const areWordsClose = (queryWords, pageText, maxDistance) => {
    // Map to store the positions of each word in the pageText
    const positions = queryWords.map(word => {
        const indices = [];
        pageText.forEach((textWord, index) => {
            if (calculateSimilarity(word, textWord) > 0.8) {
                indices.push(index);
            }
        });
        return indices;
    });

    // If any word is not found in the text, return false
    if (positions.some(posArray => posArray.length === 0)) {
        return false;
    }

    // Helper function to find the closest sequence starting at the given index
    const findClosestSequence = (startIndex) => {
        let currentIndex = startIndex;

        for (let i = 1; i < queryWords.length; i++) {
            const nextPositions = positions[i];
            const closestNext = nextPositions.find(pos => Math.abs(pos - currentIndex) <= maxDistance);

            if (closestNext === undefined) {
                return false; // No valid next word found within the distance
            }

            currentIndex = closestNext; // Update the current index to the next word's position
        }

        return startIndex; // Return the start index if the sequence is valid
    };

    // Iterate over starting positions of the first word
    for (let start of positions[0]) {
        const sequenceStart = findClosestSequence(start);
        if (sequenceStart !== false) {
            return {
                text: queryWords.join(" "),
                index: sequenceStart
            };
        }
    }

    return false; // No valid sequence found
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