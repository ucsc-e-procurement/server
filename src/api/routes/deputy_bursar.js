/* eslint-disable linebreak-style */
const express = require("express");
const passport = require("passport");

const router = express.Router();
// const middlewares = require('../middlewares');
const jwt = require("jsonwebtoken");
require("../../config/passport_config");

const DeputyBursarModel = require("../../models/deputy_bursar_model")

module.exports = (app) => {
  app.use("/deputy_bursar", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Get Procurements
  router.get("/procurements", (req, res) => {

    // res.send("Getting procurements").status(200).end();

    directorModel.getProcurements().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get product requisition list
  router.get("/product_requisition", (req, res) => {
    DeputyBursarModel.getProductRequisitionList().then(result => {
        console.log("Result: ", result );
        res.json(result);
    }).catch(err => {
        res.send(err)
    });   
  });

  // Get product requisition details
  router.get("/product_requisition/details", (req, res) => {
    console.log("id is",req.query.requisitionId)
    DeputyBursarModel.getProductRequisition(req.query.requisitionId).then(result => {
        res.json(result);
    }).catch(err => {
        res.send(err)
    });   
  });

  // Approve requisition
  router.post("/product_requisition/approve", (req, res) => {
    DeputyBursarModel.approveRequisition(req.query.requisitionId, req.query.selectedFundType ).then((result) => {
      console.log("Result: ", result );
      res.json(result);
    }).catch(err => {
      res.send(err)
    });   
  });

  // Deny requisition
  router.post("/product_requisition/deny", (req, res) => {
    DeputyBursarModel.denyRequisition(req.query.requisitionId, req.query.remarks).then((result) => {
      console.log("Result: ", result );
      res.json(result);
    }).catch(err => {
      res.send(err)
    });   
  });
};
