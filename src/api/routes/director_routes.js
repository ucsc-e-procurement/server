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
  router.get("/requisitions/:id", (req, res) => {

    // res.send("Getting Requisition" + req.query.id).status(200).end();

    directorModel.getRequisition(req.query.reqId).then((result) => {
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
  router.get("/procurements/:id", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getProcurement(req.query.procId).then((result) => {
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

  // Get Employees
  router.get("/getemployees", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getEmployees().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get tech team
  router.get("/get_tec_team", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getTechTeam(req.query.techTeamId).then((result) => {
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
  router.post("/procurements/appointTechTeam", (req, res) => {

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

  router.get("/get_bid_opening_team", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getBidOpeningTeam(req.query.bidOpeningTeamId).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get employees not in tec team
  router.get("/get_employees_not_in_tec_team", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getEmployeesNotInTecTeam(req.query.tecTeamId).then((result) => {
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
  router.post("/procurements/appointBidOpeningTeam", (req, res) => {

    // res.send("Appointing bid opening team for procurement " + req.params.id + ": " + req.body).status(200).end();

    directorModel.appointBidOpeningTeam(req.body.bidOpeningTeamId, req.body.procurementId, req.body.directorId, req.body.member_1, req.body.member_2).then((result) => {
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
