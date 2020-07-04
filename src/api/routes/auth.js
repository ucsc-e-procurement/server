/* eslint-disable linebreak-style */
const express = require("express");
const passport = require("passport");

const router = express.Router();
// const middlewares = require('../middlewares');
const jwt = require("jsonwebtoken");
require("../../config/passport_config");

const { use } = require("passport");
const UserModel = require("../../models/user_model");

module.exports = (app) => {
  app.use("/auth", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("", (req, res) => {
    res.send("Ayubowan! from Auth Routes, I'm Working").status(200).end();
  });

  // Login
  router.post("/login", (req, res, next) => {
    if (req.body.email === "" || req.body.password === "") {
      res.json({
        status: 400,
        error: "",
        error_message: "Invalid Arguments",
        error_code: "1001",
      });
      return;
    }
    try {
      passport.authenticate("login", async (err, user, info) => {
        try {
          if (err || !user) {
            res.json({
              status: 400,
              error_message: "Authentication Failed",
              error_code: "1002",
            });
            return err;
          }
          req.login(user, { session: false }, async (error) => {
            if (error) return error;

            const body = {
              ...user,
            };

            // Sign the JWT token and populate the payload with the user email and id
            const token = jwt.sign({ user: body }, "top_secret_key_here");

            // Send back the token to the user(Client Side)
            return res.json({
              status: 200,
              message: "Login Success",
              token,
            });
          });
        } catch (error) {
          res.json({
            status: 400,
            error_message: "Authentication Failed",
            error_code: "1003",
          });
          return error;
        }
      })(req, res, next);
    } catch (error) {
      res.json({
        status: 400,
        error_message: "Authentication Failed",
        error_code: "1004",
      });
    }
  });
};
