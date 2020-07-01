const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const supplier = require("./routes/supplier_routes");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  // Authentication
  auth(app);

  // Supplier Route
  supplier(app);

  return app;
};
