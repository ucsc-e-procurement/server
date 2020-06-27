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
    res.send("Ayubowan! from Director Routes, I'm Working").status(200).end();
  });

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
