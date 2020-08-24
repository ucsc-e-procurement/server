  /* eslint-disable linebreak-style */
const express = require("express");
const passport = require("passport");

const router = express.Router();
// const middlewares = require('../middlewares');
const jwt = require("jsonwebtoken");
require("../../config/passport_config");

const PurchaseOrderModel = require("../../models/purchase_order_model")

module.exports = (app) => {
  app.use("/admin", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------
  // Get PO data
  router.get("/purchase_order", (req, res) => {
    PurchaseOrderModel.getPurchaseOrderData().then((result) => {
      console.log("Result: ", result );
      res.json(result);
    }).catch(err => {
      res.send(err)
    });   
  });
}