const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const middlewares = require("../middlewares");

// Database Models
const supplierModel = require("../../models/supplier_model");

module.exports = (app) => {
  app.use("/supplier", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("", (req, res) => {
    res.send("Ayubowan! from Test Routes, I'm Working").status(200).end();
  });

  router.get("/db", (req, res) => {
    testModel.test().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  });

  router.post("/find_user", (req, res) => {
    console.log(req.body);
    userModel.findUserByEmailAndPassword(req.body.username, req.body.password).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });

  router.post("/bcrypt/create_password_hash", async (req, res) => {
  // Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  // your application becomes.
    const hash = await bcrypt.hash(req.body.password, 10);
    res.json({ hashed_password: hash });
  });

  
  
  //supplier routes

  router.get("/get_supplier/", (req, res) => {
    var supplier_id = req.query.id
    console.log(supplier_id)
    supplierModel.getSupplierData(supplier_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
    //res.send("get rfgs")
  });

  router.get("/get_new_requests/", (req, res) => {
    var supplier_id = req.query.id
    console.log(supplier_id)
    supplierModel.getNewRequests(supplier_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
    //res.send("get rfgs")
  });

  router.get("/get_ongoing_procurements/", (req, res) => {
    var supplier_id = req.query.id
    console.log(supplier_id)
    supplierModel.getOngoingProcurements(supplier_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_completed_procurements/", (req, res) => {
    var supplier_id = req.query.id
    console.log(supplier_id)
    supplierModel.getCompletedProcurements(supplier_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

};
