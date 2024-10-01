const formatResultsForUserLevel = (results, userLevel) => {
    return results.map(result => {
        // Format result based on user level (e.g., different content for beginners and advanced users)
        return {
            title: result.title,
            content: result.content,
            level: userLevel,
            // Add more fields as needed
        };
    });
};

module.exports = { formatResultsForUserLevel };
