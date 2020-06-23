const express = require("express");


// Route Imports
const test = require("./routes/test_routes");

module.exports = () => {
    const app = express.Router();

    // Test Route
    test(app);
    
    return app;
};