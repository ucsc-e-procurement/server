const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const deputyBursar = require("./routes/deputy_bursar")

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);
  deputyBursar(app);

  // Authentication
  auth(app);

  return app;
};
