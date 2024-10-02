const fs = require('fs');
const path = require('path');

const services = {};

// Function to load services dynamically
const loadServices = (directory) => {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            loadServices(fullPath);  // Recursively load subdirectories
        } else if (file.endsWith('Service.js')) {
            const serviceName = path.basename(file, '.js');
            services[serviceName] = require(fullPath);  // Load the service
        }
    });
};

// Define the base directory (this should be updated if your structure changes)
const baseDirectory = path.join(__dirname);

// Load services from each folder
loadServices(path.join(baseDirectory, 'additional_resources'));
loadServices(path.join(baseDirectory, 'general_education'));
loadServices(path.join(baseDirectory, 'graduate'));
loadServices(path.join(baseDirectory, 'specialized_research'));
loadServices(path.join(baseDirectory, 'undergraduate'));

// Export the loaded services
module.exports = services;
