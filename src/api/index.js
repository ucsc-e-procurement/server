const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const hod = require("./routes/hod");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  // Authentication
  auth(app);

  // Head of department
  hod(app);

  return app;
};
