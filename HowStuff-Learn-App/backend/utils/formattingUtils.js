const { adjustContentForUserLevel } = require('./aiUtils');

// Format results based on user level
const formatResultsForUserLevel = async (results, userLevel) => {
    // Map each result to a promise for adjusting content
    const formattedResults = await Promise.all(results.map(async (result) => {
        try {
            // Adjust the content based on the user level
            const adjustedContent = await adjustContentForUserLevel(result.content, userLevel);

            // Return the formatted result with title, adjusted content, and user level
            return {
                title: result.title,
                content: adjustedContent,
                level: userLevel,
            };
        } catch (error) {
            console.error(`Error adjusting content for title "${result.title}": ${error.message}`);
            // Return the original content in case of an error
            return {
                title: result.title,
                content: result.content, // Fallback to original content
                level: userLevel,
            };
        }
    }));

    return formattedResults; // Return the array of formatted results
};

module.exports = { formatResultsForUserLevel };
