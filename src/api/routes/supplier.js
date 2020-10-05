const express = require("express");
const bcrypt = require("bcrypt");
const formidable = require('formidable');
const crypto = require('crypto');

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

  // -----------------------------------------------------------------------------------------------------

  router.get("/registration/check_supplier", (req, res) => {
    supplierModel.checkExistingSupplier(req.query.email)
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
      })
  })

  router.get("/registration/get_current_info", (req, res) => {
    supplierModel.getSupplierInfo(req.query.email)
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
      })
  })

  router.post("/registration", (req, res) => {
    new formidable.IncomingForm().parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }      
      supplierModel.registerSupplier(fields.email, fields.password, fields.user_state)
        .then(() => {
          supplierModel.saveSupplierInfo(fields, files)
            .then(() => {
              supplierModel.saveSupplierRegistration(fields, files)
                .then(() => {
                  res.send("Successful").end();
                })
            })
        })
        .catch(err => {
          console.log(err);
        })
    });
  });

  router.get("/price_schedule/get_file", (req, res) => {
    supplierModel.getAuthFile()
      .then(result => {
        res.set('Content-Type', 'application/pdf').send(result[0].document).end()
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.get("/price_schedule/get_bid_guarantee", (req, res) => {
    supplierModel.getBidFile()
      .then(result => {
        res.set('Content-Type', 'application/pdf').send(result[0].document).end()
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.get("/price_schedule/encryption_data", (req, res) => {
    try {
      const data = JSON.stringify(req.query);
      const algorithm = 'aes256';
      const key = crypto.randomBytes(32); 

      let cipher = crypto.createCipher(algorithm, key.toString('hex'));
      let endata = cipher.update(data,'utf8','hex') + cipher.final('hex');

      res.json({
        key: key.toString('hex'),
        encrypted: endata
      }).status(200);
  
    }catch(error){
        console.log(error);
        res.json({'error':error}).status(500);
    }
  });

  router.post("/price_schedule/update_firebase", (req, res) => {    
    supplierModel.addBidToFirebase(req.body)
      .then(() => {
        res.send("Successful").status(200).end();
      })
      .catch(err => {
        console.log(err);
      })
  });

  router.post("/price_schedule/:procurement", (req, res) => {
    new formidable.IncomingForm().parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }      
      supplierModel.enterSupplierBid(fields)
        .then(() => {
          res.send("Successful").status(200).end();
        })
        .catch(err => {
          console.log(err);
        })
    });
  });

  router.post("/price_schedule_direct/:procurement", (req, res) => {
    supplierModel.enterSupplierQuotation(req.body).then(result => {
      supplierModel.saveBidProducts(req.body.items, result.insertId)
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
    console.log(supplier_id, "hello");
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

  router.get("/get_pending_orders/", (req, res) => {
    const supplier_id = req.query.id;
    supplierModel.getPendingOrders(supplier_id).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });

  router.get("/get_completed_orders/", (req, res) => {
    const supplier_id = req.query.id;
    supplierModel.getCompletedOrders(supplier_id).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });
};
