const express = require("express");

const router = express.Router();
const passport = require("passport");
// const middlewares = require("../middlewares");

// Database Models
const UserModel = require("../../models/user_model");
const EmployeeModel = require("../../models/employee_model");
const SupplierModel = require("../../models/supplier_model");

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

  // Get All Users
  router.get("/get_all_users", async (req, res) => {
    try {
      const users = await UserModel.getUsers();

      if (users.length > 0) {
        const tempArray = [];

        users.forEach(async (user) => {
          let tempUser = {};
          if (user.user_role !== "SUP") {
            // Internal Staff
            const employee = await EmployeeModel.getEmplyeeByUserId(user.user_id);
            tempUser = { ...user, ...employee };
            tempArray.push(tempUser);
          } else {
            // External User - Supplier
            const supplier = await SupplierModel.getSupplierByUserId(user.user_id);
            tempUser = { ...user, ...supplier };
            tempArray.push({ ...user, ...supplier });
          }
        //   console.log("TempUser: ", tempUser);
        });
        console.log("TempUser Array: ", tempArray);
      } else {

      }
    } catch (error) {

    }
  });
};
