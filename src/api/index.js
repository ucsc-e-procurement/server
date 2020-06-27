const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  // Authentication
  auth(app);

  return app;
};
