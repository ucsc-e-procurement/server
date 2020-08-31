const express = require("express");

const router = express.Router();
// const passport = require("passport");

// Database Models
// const UserModel = require("../../models/user_model");
// const EmployeeModel = require("../../models/employee_model");
// const SupplierModel = require("../../models/supplier_model");
// const ProductModel = require("../../models/products_model");
// const RequisitionModel = require("../../models/requisition_model");
// const TestModel = require("../../models/test_model");
const ProcurementModel = require("../../models/procurement_model");
const BidModel = require("../../models/bid_model");

// Configurations
require("../../config/passport_config");

// Logger
const logger = require("../../config/winston_config");

module.exports = (app) => {
  app.use("/admin", router);

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
  //                                                   Test Route - Firebase Doc to MySQL
  // ######################################################################################################################################################
  router.post("/test/firebaseToSQL", async (req, res, next) => {
    try {
      let jsonData = JSON.parse(req.body.data_string);

      const result_1 = await BidModel.createBid(jsonData);
      const result_2 = await ProcurementModel.updateProcurementStep(
        jsonData.procurement_id,
        7
      );

      res.status(201).json({ message: "success", jsonData: jsonData });
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error Occured",
          description: error,
        },
      });
    }
  });
};
