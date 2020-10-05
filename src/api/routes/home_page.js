  /* eslint-disable linebreak-style */
  const express = require("express");
  const passport = require("passport");
  
  const router = express.Router();
  // const middlewares = require('../middlewares');
  const jwt = require("jsonwebtoken");
  require("../../config/passport_config");
  
  const HomePageModel = require("../../models/home_page_model")
  
  module.exports = (app) => {
    app.use("/home_page", router);
  
    // ----------------------------------------------------------------------------------------
    //                               Route Endpoints
    // ----------------------------------------------------------------------------------------
    // Get ongoing procurements
    router.get("", (req, res) => {
      HomePageModel.getOngoingProcurements().then((result) => {
        console.log("Result: ", result );
        res.json(result);
      }).catch(err => {
        res.send(err)
      });   
    });

    // Get ongoing procurements data
    router.get("/details", (req, res) => {
        HomePageModel.getOngoingProcurementsData(req.query.procurementId).then((result) => {
            console.log("Result: ", result );
            res.json(result);
        }).catch(err => {
            res.send(err)
        });   
    });
  }