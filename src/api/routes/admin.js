const express = require("express");

const router = express.Router();
const passport = require("passport");
// const middlewares = require("../middlewares");

// Database Models
const UserModel = require("../../models/user_model");
const EmployeeModel = require("../../models/employee_model");
const SupplierModel = require("../../models/supplier_model");
const ProductModel = require("../../models/products_model");
const RequisitionModel = require("../../models/requisition_model");
const AdminModel = require("../../models/admin_model");

require("../../config/passport_config");

module.exports = (app) => {
  app.use("/admin", router);

  // Handle errors
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
  });

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("", (req, res, next) => {
    res.send("Ayubowan! from Admin Routes, I'm Working").status(200).end();
  });

  // ################################### Get All Users #######################################
  router.get("/users", async (req, res) => {
    try {
      const users = await UserModel.getUsers();

      if (users.length > 0) {
        const tempArray = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const user of users) {
          if (user.user_role !== "SUP") {
            // Internal Staff
            const employee = await EmployeeModel.getEmplyeeByUserId(user.user_id);
            tempArray.push({ ...user, ...employee });
          } else {
            // External User - Supplier
            const supplier = await SupplierModel.getSupplierByUserId(user.user_id);
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

    }
  });

  router.put("/change_user_status", async (req, res, next) => {
    console.log("change_user_status: ", req.body);
    const updatedResult = await UserModel.updateUserStatus(req.body.user_id, req.body.status);
    console.log("change_user_status: 1234", updatedResult);
    res.json({ message: updatedResult.affectedRows === 1 ? "SUCCESS" : "FAILED" });
  });

  router.get("/get_all_products", async (req, res, next) => {
    console.log("get_all_products: ");
    const result = await ProductModel.getProducts();
    console.log("get_all_products: 1234", result);
    res.json(result);
  });

  router.get("/get_all_requisitions", async (req, res, next) => {
    console.log("get_all_requisitions: ");
    const result = await RequisitionModel.getRequisitions();
    console.log("get_all_requisitions: 1234", result);
    res.json(result);
  });

  router.get("/get_product_requisition", async (req, res, next) => {
    console.log("get_all_requisitions: ", req.query);

    // Get the Requisition Data
    const requisition = await RequisitionModel.getRequisitionById(req.query.requisitionId);

    // Getting Names of Employees Involved
    const headOfDivision = await EmployeeModel.getEmployeeByEmployeeId(requisition.head_of_division_id);
    const director = await EmployeeModel.getEmployeeByEmployeeId(requisition.director_id);
    const deputyBursar = await EmployeeModel.getEmployeeByEmployeeId(requisition.deputy_bursar_id);

    // Getting Products
    const productsList = await RequisitionModel.getProductsByRequisitionId(req.query.requisitionId);
    // console.log("get_all_requisitions: 1234", requisition, headOfDivision, director, deputyBursar, productsList);

    const requisitionData = {
      ...requisition,
      hod: headOfDivision,
      director,
      deputy_burasr: deputyBursar,
      products: productsList,
    };
    res.json(requisitionData);
  });

  // Get direct ongoing procurements
  router.get("/direct_ongoing_procurements", (req, res) => {
    AdminModel.getDirectOngoingProcurements().then(result => {
        res.json(result);
    }).catch(err => {
        res.send(err)
    });   
  });

  // Get shopping ongoing procurements
  router.get("/shopping_ongoing_procurements", (req, res) => {
    AdminModel.getShoppingOngoingProcurements().then(result => {
        res.json(result);
    }).catch(err => {
        res.send(err)
    });   
  });

  // Get list of suppliers
  router.get("/direct_ongoing_procurements/suppliers", (req, res) => {
    AdminModel.getSupplierList().then(result => {
        res.json(result);
    }).catch(err => {
        res.send(err)
    });   
  });

  // Send RFQ in direct ongoing procurements
  router.post("/direct_ongoing_procurements/suppliers/send_rfq", (req, res) => {
    AdminModel.sendRFQDirectOngoingProcurements(req.query.supplierId,req.query.procurementId,req.query.date,req.query.deadline).then(result => {
        res.json(result);
        console.log("Result: ", result );
    }).catch(err => {
        res.send(err)
    });   
  });

  // Send RFQ in shopping ongoing procurements
  router.post("/shopping_ongoing_procurements/suppliers/send_rfq", (req, res) => {
    AdminModel.sendRFQShoppingOngoingProcurements(req.query.date,req.query.deadline,req.query.procurementId).then(result => {
        res.json(result);
        console.log("Result: ", result );
    }).catch(err => {
        res.send(err)
    });   
  });
  
};
