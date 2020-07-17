const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const middlewares = require("../middlewares");

// Database Models
const tecTeamModel = require("../../models/tec_team_model");

module.exports = (app) => {
  app.use("/tec_team", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  //tec_team routes

//   router.get("/get_supplier/", (req, res) => {
//     var supplier_id = req.query.id
//     console.log(supplier_id)
//     supplierModel.getSupplierData(supplier_id).then((result) => {
//         console.log('server', result)
//         res.json(result);
//     }).catch((err) => {
//         res.json(err);
//     })
//     //res.send("get rfgs")
//   });

//   router.get("/get_new_requests/", (req, res) => {
//     var supplier_id = req.query.id
//     console.log(supplier_id)
//     supplierModel.getNewRequests(supplier_id).then((result) => {
//         console.log('server', result)
//         res.json(result);
//     }).catch((err) => {
//         res.json(err);
//     })
//     //res.send("get rfgs")
//   });

router.get("/get_locked_procurements/", (req, res) => {
  var employee_id = req.query.id
  console.log(employee_id)
  tecTeamModel.getLockedProcurements(employee_id).then((result) => {
      console.log('server', result)
      res.json(result);
  }).catch((err) => {
      res.json(err);
  })
});

router.get("/get_unlocked_procurements/", (req, res) => {
    var employee_id = req.query.id
    console.log(employee_id)
    tecTeamModel.getUnlockedProcurements(employee_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_completed_procurements/", (req, res) => {
    var employee_id = req.query.id
    console.log(employee_id)
    tecTeamModel.getCompletedProcurements(employee_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_itemwise_bids/", (req, res) => {
    var procurement_id = req.query.id
    console.log(procurement_id)
    tecTeamModel.getItemWiseBids(procurement_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_packaged_bids/", (req, res) => {
    var procurement_id = req.query.id
    console.log(procurement_id)
    tecTeamModel.getPackagedBids(procurement_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_requisition/", (req, res) => {
    var requisition_id = req.query.id
    console.log('requisition_id',requisition_id)
    tecTeamModel.getRequisition(requisition_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_tec_team/", (req, res) => {
    var tec_team_id = req.query.id
    tecTeamModel.getTecTeam(tec_team_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

};
