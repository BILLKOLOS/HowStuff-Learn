// Import the Elasticsearch client
const { Client } = require('@elastic/elasticsearch');

// Create an instance of the Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' }); // Replace with your Elasticsearch server URL

// Function to check connection status
const checkConnection = async () => {
    try {
        const response = await client.ping();
        console.log('Elasticsearch cluster is reachable:', response);
    } catch (error) {
        console.error('Elasticsearch cluster is not reachable:', error);
    }
};

// Export the client and connection check function
module.exports = {
    client,
    checkConnection
};
