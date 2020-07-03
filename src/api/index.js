const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");

const tec_team = require("./routes/tec_team");

// TODO Merge
//const supplier = require("./routes/supplier_routes");
//const supplier = require("./routes/supplier");

const director = require("./routes/director_routes");
const deputyBursar = require("./routes/deputy_bursar");
const hod = require("./routes/hod");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  deputyBursar(app);

  // Authentication
  auth(app);

  //supplier
  supplier(app);

  //tec team
  tec_team(app);

  // Supplier Route
  //supplier(app);

  director(app);

  // Head of department
  hod(app);

  return app;
};
