const { adjustContentForUserLevel } = require('./aiUtils');

// Format results based on user level
const formatResultsForUserLevel = async (results, userLevel) => {
    const formattedResults = [];

    for (const result of results) {
        // Adjust the content based on the user level
        const adjustedContent = await adjustContentForUserLevel(result.content, userLevel);

        // Push the formatted result with title, adjusted content, and user level
        formattedResults.push({
            title: result.title,
            content: adjustedContent,
            level: userLevel,
        });
    }

    return formattedResults; // Return the array of formatted results
};

module.exports = { formatResultsForUserLevel };
