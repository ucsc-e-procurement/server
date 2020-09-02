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
const purchase_order = require("./routes/purchase_order");
const admin = require("./routes/admin");
const external = require("./routes/external");
const admin_analytics = require("./routes/admin_analytics");


// const signature = require("./routes/signature");

module.exports = () => {
  const app = express.Router();

  // Test Route
  test(app);

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

  // Purchase Order
  purchase_order(app);
  
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
