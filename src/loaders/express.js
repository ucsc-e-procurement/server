const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("../api");
const config = require("../config");

module.exports = (app) => {
  // ------------------------------------------------------------------------------------------
  //                                  Health Check Endpoints
  // ------------------------------------------------------------------------------------------
  app.get("/status", (req, res) => {
    res.send("Ayubowan").status(200).end();
  });

  // ------------------------------------------------------------------------------------------
  //                                  Middleware Integrations
  // ------------------------------------------------------------------------------------------

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Enable Cross Origin Resource Sharing(CORS) to all origins by default
  app.use(cors({ origin: true }));

  // ------------------------------------------------------------------------------------------
  //                                  Integrate All the Routes
  // ------------------------------------------------------------------------------------------
  // Load API routes with Prefix - /api/<whatever the route>
  console.log("Routes: ", routes());

  app.use(config.api.prefix, routes());
};
