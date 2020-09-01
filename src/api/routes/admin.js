const express = require("express");

const router = express.Router();
// const passport = require("passport");

// Database Models
const UserModel = require("../../models/user_model");
const EmployeeModel = require("../../models/employee_model");
const SupplierModel = require("../../models/supplier_model");
const ProductModel = require("../../models/products_model");
const RequisitionModel = require("../../models/requisition_model");
const TestModel = require("../../models/test_model");
const ProcurementModel = require("../../models/procurement_model");
const BidModel = require("../../models/bid_model");
const AdminModel = require("../../models/admin_model");

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
  //                                                            Get All Users
  // ######################################################################################################################################################
  router.get("/users", async (req, res) => {
    logger.info("Admin --> GET /users invoked");
    try {
      const users = await UserModel.getUsers();

      if (users.length > 0) {
        const tempArray = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const user of users) {
          if (user.user_role !== "SUP") {
            // Internal Staff
            const employee = await EmployeeModel.getEmplyeeByUserId(
              user.user_id
            );
            tempArray.push({ ...user, ...employee });
          } else {
            // External User - Supplier
            const supplier = await SupplierModel.getSupplierByUserId(
              user.user_id
            );
            tempArray.push({ ...user, ...supplier });
          }
        }

        // for (let index = 0; index < users.length; index++) {
        //   const user = users[index];
        //   if (user.user_role !== "SUP") {
        //     // Internal Staff
        //     const employee = await EmployeeModel.getEmplyeeByUserId(user.user_id);
        //     tempArray.push({ ...user, ...employee });
        //   } else {
        //     // External User - Supplier
        //     const supplier = await SupplierModel.getSupplierByUserId(user.user_id);
        //     tempArray.push({ ...user, ...supplier });
        //   }
        // }
        res.json(tempArray);
      } else {
      }
    } catch (error) {
      logger.error(error);
    }
  });
  // ######################################################################################################################################################
  //                                                      Change User Status
  // ######################################################################################################################################################
  router.put("/change_user_status", async (req, res, next) => {
    console.log("change_user_status: ", req.body);
    const updatedResult = await UserModel.updateUserStatus(
      req.body.user_id,
      req.body.status
    );
    console.log("change_user_status: 1234", updatedResult);
    res.json({
      message: updatedResult.affectedRows === 1 ? "SUCCESS" : "FAILED",
    });
  });

  // ######################################################################################################################################################
  //                                                      Get All Products
  // ######################################################################################################################################################
  router.get("/get_all_products", async (req, res, next) => {
    console.log("get_all_products: ");
    const result = await ProductModel.getProducts();
    console.log("get_all_products: 1234", result);
    res.json(result);
  });
  // // ######################################################################################################################################################
  // //                                                      Get Requisitions
  // // ######################################################################################################################################################
  router.get("/requisitions", async (req, res, next) => {
    logger.info("Admin --> GET /requisitions Invoked");

    console.log("get_all_requisitions: ");
    const result = await RequisitionModel.getRequisitions();
    console.log("get_all_requisitions: 1234", result);
    res.json(result);
  });
  // ######################################################################################################################################################
  //                                                      Get Requisition By ID
  // ######################################################################################################################################################
  router.get("/requisition", async (req, res, next) => {
    logger.info("Admin --> GET /requisition Invoked");
    console.log("get_all_requisitions: ", req.query);

    // Get the Requisition Data
    const requisition = await RequisitionModel.getRequisitionById(
      req.query.requisitionId
    );

    // Getting Names of Employees Involved
    const headOfDivision = await EmployeeModel.getEmployeeByEmployeeId(
      requisition.head_of_division_id
    );
    const director = await EmployeeModel.getEmployeeByEmployeeId(
      requisition.director_id
    );
    const deputyBursar = await EmployeeModel.getEmployeeByEmployeeId(
      requisition.deputy_bursar_id
    );

    // Getting Products
    const productsList = await RequisitionModel.getProductsByRequisitionId(
      req.query.requisitionId
    );
    console.log("get_all_requisitions: 1234", productsList);

    const requisitionData = {
      ...requisition,
      hod: headOfDivision,
      director,
      deputy_burasr: deputyBursar,
      products: productsList,
    };
    console.log("############ ", requisitionData);
    res.json(requisitionData);
  });
  // ######################################################################################################################################################
  //                                                   Procurement Initialization
  // ######################################################################################################################################################
  router.post("/procurement/init", async (req, res, next) => {
    logger.info("Admin --> POST /procurement/init invoked");

    const reqData = req.body;

    try {
      // Get the Product Requisition By ID
      const productRequisition = await RequisitionModel.getRequisitionById(
        reqData.requisitionId
      );

      // Generate Procurement ID
      const procurementId = `UCSC/${reqData.procurementMethod}/${productRequisition.procurement_type}/${productRequisition.division}/${reqData.requisitionId}`;
      console.log("ID: ", productRequisition, procurementId);
      // Insert into the Procurement Table
      let procurementData = {
        procurement_id: procurementId,
        procurement_method: reqData.procurementMethod,
        bid_opening_date: reqData.bidOpeningDate,
        expiration_date: reqData.bidExpirationDate,
        requisition_id: reqData.requisitionId,
        bid_opening_team_id: null,
        tec_team_id: null,
        assistant_bursar_id: reqData.assistantBursarId,
        po_id: "NA",
        status: "on-going",
        step: 1,
        category: reqData.procurementCategory,
        procurement_type: productRequisition.procurement_type,
        completed_date: null,
        finance_method: productRequisition.fund_type,
      };
      const result = await ProcurementModel.createProcurement(procurementData);
      logger.info(result);

      res.status(201).json({ message: "Procurement Created Succesfully" });
    } catch (error) {
      console.log(error);
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "",
          description: error,
        },
      });
    }
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
  // ######################################################################################################################################################
  //                                                      Get User Roles
  // ######################################################################################################################################################
  router.get("/user_roles_internal", async (req, res, next) => {
    logger.info("Admin --> GET /user_roles_internal invoked");

    try {
      let result = await UserModel.getUserRoles();
      res.json(result);
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                      Get Next Employee ID
  // ######################################################################################################################################################
  router.get("/next_employee_id", async (req, res, next) => {
    logger.info("Admin --> GET /next_employee_id invoked");

    try {
      let result = await UserModel.getLastEmployeeRecord();
      let empId = String(result[0].employee_id);
      let numericVal = parseInt(empId.substr(3)) + 1;
      let paddedVal =
        numericVal < 10
          ? `000${numericVal}`
          : numericVal < 100
            ? `00${numericVal}`
            : numericVal < 1000
              ? `0${numericVal}`
              : numericVal < 10000
                ? `${numericVal}`
                : String(numericVal);
      let nextEmpId = "emp" + paddedVal;
      res.json(nextEmpId);
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                      Create New User
  // ######################################################################################################################################################
  router.post("/user", async (req, res, next) => {
    logger.info("Admin --> POST /user invoked");

    let userData = {
      employee_id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      user_id: req.body.email,
      password: req.body.password,
      division: req.body.division,
      user_role: req.body.role,
    };

    try {
      let result_1 = await UserModel.createUser(userData);
      let result_2 = await EmployeeModel.createEmployee(userData);

      console.log(result_1, result_2);
      res.status(201).json({ message: "user created successfully" });
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                      Get All Products Related to the Product Requitition
  // ######################################################################################################################################################
  router.post("/user", async (req, res, next) => {
    logger.info("Admin --> POST /user invoked");

    let userData = {
      employee_id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      user_id: req.body.email,
      password: req.body.password,
      division: req.body.division,
      user_role: req.body.role,
    };

    try {
      let result_1 = await UserModel.createUser(userData);
      let result_2 = await EmployeeModel.createEmployee(userData);

      console.log(result_1, result_2);
      res.status(201).json({ message: "user created successfully" });
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                   Check Whether a Requisition is Initialized OR Not
  // ######################################################################################################################################################
  router.get("/procurement/is_initialized", async (req, res, next) => {
    logger.info("Admin --> GET /procurement/is_initialized invoked");

    try {
      let requisitionId = req.query.requisitionId;
      console.log(requisitionId);

      const result = await ProcurementModel.getProcurementByRequisitionId(
        requisitionId
      );
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz ", result);
      res.status(200).json({
        is_initialized: result.length > 0 ? true : false,
      });
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                      Get All Procurements By Status
  // ######################################################################################################################################################
  router.get("/procurements/status", async (req, res, next) => {
    logger.info("Admin --> GET /procurements/status invoked");

    const status = req.query.status;
    try {
      let result = await ProcurementModel.getProcurementsByStatus(status);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                      Get Procurement By ID
  // ######################################################################################################################################################
  router.get("/procurement", async (req, res, next) => {
    logger.info("Admin --> GET /procurement invoked");

    const procurementId = req.query.id;

    try {
      let result = await ProcurementModel.getProcurementsById(procurementId);
      res.status(200).json(result);
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                      Get Tech Team By Procurement ID
  // ######################################################################################################################################################
  router.get("/procurement/tech-team", async (req, res, next) => {
    logger.info("Admin --> GET /procurement/tech-team invoked");

    const techteamId = req.query.id;

    try {
      let result = await ProcurementModel.getTechTeamById(techteamId);
      console.log(result);
      res.status(200).json(result);
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
  // ######################################################################################################################################################
  //                                                      Get All Suppliers
  // ######################################################################################################################################################
  router.get("/suppliers", async (req, res, next) => {
    logger.info("Admin --> GET /suppliers invoked");

    AdminModel.getSuppliers().then(suppliers => {
      res.status(200).json(suppliers);
    }).catch(err => {
      logger.error(err);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error Occured",
          description: err,
        },
      });
    });
    
  });
  // ######################################################################################################################################################
  //                                                      Get Supplier By ID
  // ######################################################################################################################################################
  router.get("/supplier", async (req, res, next) => {
    const supplierId = req.query.id;
    logger.info("Admin --> GET /supplier?id=" + supplierId + " invoked");

    AdminModel.getSupplierById(supplierId).then(supplier => {
      res.status(200).json(supplier);
    }).catch(err => {
      logger.error(err);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error Occured",
          description: err,
        },
      });
    });
    
  });
  // ######################################################################################################################################################
  //                                                      Get Signature Status - Added / Verified ? ********************************************************
  // ######################################################################################################################################################
  router.get("/signature/status", async (req, res, next) => {
    logger.info("Admin --> GET /signature/status invoked");

    const userId = req.query.id;
    try {
      let result = await ProcurementModel.getProcurementsByStatus(status);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });
  // ######################################################################################################################################################
  //                                                      Get All Procurement Related to a Supplier
  // ######################################################################################################################################################
  router.get("/bids/supplier", async (req, res, next) => {
    logger.info("Admin --> GET /bids/supplier?supplierId=" + req.query.supplierId + " invoked");

    const supplierId = req.query.supplierId;
    try {
      let result = await BidModel.getBidsBySupplierId(supplierId);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      logger.error(error);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: error,
        },
      });
    }
  });

  // ######################################################################################################################################################
  //                                                      Get Bid Info By Bid ID
  // ######################################################################################################################################################
  router.get("/bid", (req, res, next) => {
    logger.info("Admin --> GET /bid?id=" + req.query.id + " invoked");
    const bidId = req.query.id;

    let bidData = null;

    BidModel.getBidById(bidId).then(bid => {
      bidData = {...bid};
      return BidModel.getBidProductsById(bidId);
    }).then(bidProducts => {
      bidData = {...bidData, products: JSON.parse(JSON.stringify(bidProducts))};
      console.log("BidProducts: ", bidProducts, bidData);


      res.status(200).json(bidData);
      return;
    }).catch(err => {
      logger.error(err);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: err,
        },
      });
    });
  });

  // ######################################################################################################################################################
  //                                                      Get Registration By Year
  // ######################################################################################################################################################
  router.get("/registrations/year", async (req, res, next) => {
    logger.info("Admin --> GET /registrations/year?year=" + req.query.year + " invoked");

    const year = req.query.year;

    AdminModel.getRegistrationsByYear(year).then(results => {
      res.status(200).json(results);
    }).catch(err => {
      logger.error(err);

      res.status(400).json({
        error: {
          code: "0000",
          message: "Error",
          description: err,
        },
      });
    });
   
  });
};
