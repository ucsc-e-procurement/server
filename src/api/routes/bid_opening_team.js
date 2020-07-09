const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const middlewares = require("../middlewares");

// Database Models
const bidOpeningTeamModel = require("../../models/bid_opening_team_model");

module.exports = (app) => {
  app.use("/bid_opening_team", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  //bid_opening_team routes

//   router.get("/get_ongoing_procurements/", (req, res) => {
//     var employee_id = req.query.id
//     console.log(employee_id)
//     tecTeamModel.getOngoingProcurements(employee_id).then((result) => {
//         console.log('server', result)
//         res.json(result);
//     }).catch((err) => {
//         res.json(err);
//     })
//   });

  router.get("/get_completed_procurements/", (req, res) => {
    var employee_id = req.query.id
    console.log(employee_id)
    bidOpeningTeamModel.getCompletedProcurements(employee_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

//   router.get("/get_requisition/", (req, res) => {
//     var requisition_id = req.query.id
//     console.log('requisition_id',requisition_id)
//     tecTeamModel.getRequisition(requisition_id).then((result) => {
//         console.log('server', result)
//         res.json(result);
//     }).catch((err) => {
//         res.json(err);
//     })
//   });

//   router.get("/get_tec_team/", (req, res) => {
//     var tec_team_id = req.query.id
//     tecTeamModel.getTecTeam(tec_team_id).then((result) => {
//         console.log('server', result)
//         res.json(result);
//     }).catch((err) => {
//         res.json(err);
//     })
//   });

};
