const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const supplier = require("./routes/supplier_routes");
const director = require("./routes/director_routes")
const deputyBursar = require("./routes/deputy_bursar")
const hod = require("./routes/hod");


module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);
  
  deputyBursar(app);

  // Authentication
  auth(app);

  // Supplier Route
  supplier(app);

  director(app);

  // Head of department
  hod(app);
  
  return app;
};
