const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const passport = require("passport");
const middlewares = require("../middlewares");

// Database Models
const testModel = require("../../models/test_model");
const userModel = require("../../models/user_model");

require("../../config/passport_config");

module.exports = (app) => {
  app.use("/test", router);

  // Handle errors
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
  });

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("", (req, res, next) => {
    res.send("Ayubowan! from Test Routes, I'm Working").status(200).end();
  });

  router.get("/db", (req, res) => {
    testModel.test().then((result) => {
      // eslint-disable-next-line no-console
      console.log(result);
      res.json(result).status(200).end();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.send(err).status(200).end();
    });
  });

  router.post("/find_user", (req, res) => {
    console.log(req.body);
    userModel.findUserByEmailAndPassword(req.body.username, req.body.password).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.json(err);
    });
  });

  router.post("/bcrypt/create_password_hash", async (req, res) => {
  // Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  // your application becomes.
    const hash = await bcrypt.hash(req.body.password, 10);
    res.json({ hashed_password: hash });
  });

  //
};
