const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
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

  director(app);

  // Head of department
  hod(app);
  
  return app;
};
