const express = require("express");

// Route Imports
const test = require("./routes/test_routes");
const auth = require("./routes/auth");
const tecTeam = require("./routes/tec_team");
const bidOpeningTeam = require("./routes/bid_opening_team");
const supplier = require("./routes/supplier");
const director = require("./routes/director_routes");
const deputyBursar = require("./routes/deputy_bursar");
const hod = require("./routes/hod");
const admin = require("./routes/admin");
const signature = require("./routes/signature");
const home_page = require("./routes/home_page");
const external = require("./routes/external");
const admin_analytics = require("./routes/admin_analytics");


// const signature = require("./routes/signature");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

  // Home Page
  home_page(app);

  // Deputy Bursar
  //Deputy Bursar
  deputyBursar(app);

  // Authentication
  auth(app);

  // Supplier
  supplier(app);

  // Tec Team
  tecTeam(app);

  //Bid Opening Team
  bidOpeningTeam(app);

  //Director
  director(app);

  // Head of Department
  hod(app);
  
  // Administrator
  admin(app);

  // External Routes - Firebase Cloud Functions
  external(app);

  // Reporting Module of Admin
  admin_analytics(app);

  // Signature
  // signature(app);

  return app;
};
