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
};
