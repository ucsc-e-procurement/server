const express = require("express");

const router = express.Router();
// const passport = require("passport");

// Database Models
const AnalyticsModel = require("../../models/admin_analytics_model");

// Configurations
require("../../config/passport_config");

// Logger
const logger = require("../../config/winston_config");

module.exports = (app) => {
  app.use("/admin-analytics", router);

  // Handle errors
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
  });

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                          Route Endpoints
  // ------------------------------------------------------------------------------------------------------------------------------------------------------

  // ######################################################################################################################################################
  //                                                    Health Check Route for Testing
  // ######################################################################################################################################################
  router.get("", (req, res, next) => {
    res.send("Ayubowan! from Admin Routes, I'm Working").status(200).end();
  });
  // ######################################################################################################################################################
  //                                         Monthly Product Requisition Count          
  // ######################################################################################################################################################
  router.get("/monthly-product-requisition-count", async (req, res, next) => {
    const year = req.query.year;
    AnalyticsModel.getMonthlyProductRequisitionCount(String(year)).then(results => {
      res.status(200).json(results);
    }).catch(err => {
      logger.error(err);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Retrieval Error",
          description: err,
        },
      });
    });
  });
};
