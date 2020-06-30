const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const supplier = require("./routes/supplier");
const tec_team = require("./routes/tec_team");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  // Authentication
  auth(app);

  //supplier
  supplier(app);

  //tec team
  tec_team(app);

  return app;
};
