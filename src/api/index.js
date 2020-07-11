const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const tecTeam = require("./routes/tec_team");
const supplier = require("./routes/supplier");
const director = require("./routes/director_routes");
const deputyBursar = require("./routes/deputy_bursar");
const hod = require("./routes/hod");
const admin = require("./routes/admin");
const signature = require("./routes/signature");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  deputyBursar(app);

  // Authentication
  auth(app);

  // Supplier
  supplier(app);

  // Tec Team
  tecTeam(app);

  director(app);

  // Head of Department
  hod(app);

  // Administrator
  admin(app);

  // Signature
  signature(app);

  return app;
};
