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

  // Get Requisition Requests
  router.get("/get_requisition_requests", (req, res) => {
    
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

  // Get Tec Appointment Requests
  router.get("/get_tec_appointment_requests", (req, res) => {
    
    // res.send("Getting Requests").status(200).end();

    directorModel.getTecAppointmentRequests().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get PO Approval Requests
  

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

  // Approve requisition*
  router.post("/requisitions/approve", (req, res) => {

    // res.send("Approve Requisition " + req.params.id + " :" + req.body)

    directorModel.approveRequisition(req.body.requisitionId, req.body.directorRemarks, req.body.directorRecommendation).then((result) => {
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

  // Max tec team id
  router.get("/get_max_tec_id", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getMaxTecTeamId().then((result) => {
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
  router.post("/procurements/appoint_tech_team", (req, res) => {

    // res.send("Appointing tech team for procurement " + req.params.id + ": " + req.body).status(200).end();

    directorModel.appointTechTeam(req.body.procurementId, req.body.directorId, req.body.employees, req.body.chairman).then((result) => {
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

  // Get max bid opening team id 
  router.get("/get_max_bid_opening_team_id", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getMaxBidTeamId().then((result) => {
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

    directorModel.appointBidOpeningTeam(req.body.procurementId, req.body.directorId, req.body.member_1, req.body.member_2, req.body.maxId).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });

  })

  // Get Approved Requisitions 
  router.get("/get_approved_requisitions", (req, res) => {

    // res.send("Getting procurement" + req.query.procId).status(200).end();
 
    directorModel.getApprovedRequisitions().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Approve PO generation*
  router.post("/procurements/:id", (req, res) => {
    res.send("Approve PO generation for procurement " + req.params.id + ": " + req.body).status(200).end();
  })

  // Get RFQ details
  router.get("/get_rfq_details", (req, res) => {
 
    directorModel.getRfqDetails(req.query.procId).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get Recent Products
  router.get("/get_recent_products", (req, res) => {
 
    directorModel.getRecentProducts().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get supplier list
  router.get("/get_suppliers", (req, res) => {

    directorModel.getSuppliers().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })

  // Get Supplier Details 
  router.get("/get_supplier_details", (req, res) => {

    directorModel.getSupplierDetails(req.query.supplierId).then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  })
};

// Get department list
router.get("/get_departments", (req, res) => {

  directorModel.getDepartments().then((result) => {
    // eslint-disable-next-line no-console
    console.log(result);
    res.json(result).status(200).end();
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    res.send(err).status(200).end();
  });
})
