const express = require("express");

const router = express.Router();
const middlewares = require("../middlewares");

// Database Models
const directorModel = require("../../models/director_model");

module.exports = (app) => {
  app.use("/director", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("", (req, res) => {
    res.send("Fuck Yeah from Director Routes, I'm Working").status(200).end();
  });


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

  // Get Requests
  router.get("/requests", (req, res) => {
    
    // res.send("Getting Requests").status(200).end();

    directorModel.getRequisitionRequests().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get Product Requisition
  router.post("/requisitions/:id", (req, res) => {

    // res.send("Getting Requisition" + req.params.id).status(200).end();

    directorModel.getRequisition(req.body.id).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get Procurement
  router.post("/procurements/:id", (req, res) => {

    // res.send("Getting procurement" + req.params.id).status(200).end();

    directorModel.getProcurement(req.body.id).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Approve requisition
  router.post("/requisitions/:id/approve", (req, res) => {

    // res.send("Approve Requisition " + req.params.id + " :" + req.body)

    directorModel.approveRequisition(req.body.id, req.body.remarks, req.body.directorId).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Appoint tech team
  router.post("/procurements/:id/appointTechTeam", (req, res) => {

    // res.send("Appointing tech team for procurement " + req.params.id + ": " + req.body).status(200).end();

    directorModel.appointTechTeam(req.body.techTeamId, req.body.procurementId, req.body.directorId, req.body.employees).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });

  })

  // Appoint bid opening team
  router.post("/procurements/:id/appointBidOpeningTeam", (req, res) => {

    // res.send("Appointing bid opening team for procurement " + req.params.id + ": " + req.body).status(200).end();

    directorModel.appointBidOpeningTeam(req.body.bidOpeningTeamId, req.body.directorId, req.body.member1, req.body.member2).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });

  })

  // Approve PO generation
  router.post("/procurements/:id", (req, res) => {
    res.send("Approve PO generation for procurement " + req.params.id + ": " + req.body).status(200).end();
  })

//   router.get("/db", (req, res) => {
//     testModel.test().then((result) => {
//       // eslint-disable-next-line no-console
//       console.log(result);
//       res.json(result).status(200).end();
//     }).catch((err) => {
//       // eslint-disable-next-line no-console
//       console.log(err);
//       res.send(err).status(200).end();
//     });
//   });

  //
};
