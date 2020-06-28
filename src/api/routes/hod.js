const express = require("express");

const router = express.Router();
//const middlewares = require("../middlewares");

// Database Models
//const testModel = require("../../models/test_model");

const data = [
  {
    id: "001",
    name: "Mike Mathews",
    dept: "ENG",
  },
  {
    id: "002",
    name: "Mike Myers",
    dept: "ADM",
  },
  {
    id: "003",
    name: "Mike Wolovitz",
    dep: "ADMTC",
  },
];

module.exports = (app) => {
  app.use("/hod", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("/:id", (req, res) => {
    res
      .send(data.filter((it) => it.id === req.param("id")))
      .status(200)
      .end();
  });

  //
};
