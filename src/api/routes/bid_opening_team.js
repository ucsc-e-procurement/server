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

  router.get("/get_unlocked_procurements/", (req, res) => {
    var employee_id = req.query.id
    console.log(employee_id)
    bidOpeningTeamModel.getUnlockedProcurements(employee_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_pending_procurements/", (req, res) => {
    var employee_id = req.query.id
    console.log(employee_id)
    bidOpeningTeamModel.getPendingProcurements(employee_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_locked_procurements/", (req, res) => {
    var employee_id = req.query.id
    console.log(employee_id)
    bidOpeningTeamModel.getLockedProcurements(employee_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

  router.get("/get_bid_opening_team/", (req, res) => {
    var bid_opening_team_id = req.query.id
    bidOpeningTeamModel.getBidOpeningTeam(bid_opening_team_id).then((result) => {
        console.log('server', result)
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })
  });

};
