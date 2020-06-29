const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const supplier = require("./routes/supplier")

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  // Authentication
  auth(app);

  //supplier
  supplier(app);

  return app;
};
