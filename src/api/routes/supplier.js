const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { sprintf } = require("sprintf-js");

const router = express.Router();
const upload = multer();

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

  // -----------------------------------------------------------------------------------------------------

  const formData = upload.fields([
    { name: "name" },
    { name: "email" },
    { name: "contact" },
    { name: "address" },
    { name: "password" },
    { name: "categories" },
    { name: "payment" },
  ]);

  router.post("/registration", formData, async (req, res) => {
    const result = await supplierModel.checkExistingSupplier(req.body.email)
      .then((results) => {
        if (results.length > 0) {
          return res.statusMessage = "User exists";
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (!result) {
      const result = await supplierModel.getLastID();
      // generate new ids for user
      const user_id = `u${sprintf("%04d", parseInt(result[0].lastID.match(/\d+/)[0]) + 1)}`;
      const supplier_id = `s${sprintf("%04d", parseInt(result[0].lastID.match(/\d+/)[0]) + 1)}`;

      supplierModel.registerSupplier(req.body, user_id)
        .then(() => {
          supplierModel.saveSupplierInfo(req, user_id, supplier_id)
            .then(() => {
              res.statusMessage = "Successfully added";
              res.send("Successful").status(200).end();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  router.post("/price_schedule", (req, res) => {
    supplierModel.enterSupplierBid(req.body).then(() => {
      supplierModel.saveBidProducts(req.body.items)
        .then(() => {
          res.send("Successful").status(200).end();
        })
        .catch((err) => {
          console.log(err);
        });
    })
      .catch((err) => {
        console.log(err);
      });
  });

  // ------------------------------------------------------------------------------------------------------

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

  // supplier routes

  router.get("/get_supplier/", (req, res) => {
    const supplier_id = req.query.id;
    console.log(supplier_id);
    supplierModel.getSupplierData(supplier_id).then((result) => {
      console.log("server", result);
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
    // res.send("get rfgs")
  });

  router.get("/get_new_requests/", (req, res) => {
    const supplier_id = req.query.id;
    console.log(supplier_id);
    supplierModel.getNewRequests(supplier_id).then((result) => {
      console.log("server", result);
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
    // res.send("get rfgs")
  });

  router.get("/get_ongoing_procurements/", (req, res) => {
    const supplier_id = req.query.id;
    console.log(supplier_id);
    supplierModel.getOngoingProcurements(supplier_id).then((result) => {
      console.log("server", result);
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });

  router.get("/get_completed_procurements/", (req, res) => {
    const supplier_id = req.query.id;
    console.log(supplier_id);
    supplierModel.getCompletedProcurements(supplier_id).then((result) => {
      console.log("server", result);
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });
};
