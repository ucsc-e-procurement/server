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
    console.log(req.body);
    if (req.body.username === "" || req.body.password === "") {
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
            return next(err);
          }
          req.login(user, { session: false }, async (error) => {
            if (error) return next(error);

            // We don't want to store the sensitive information such as the
            // user password in the token so we pick only the email and id
            const body = {
              user_id: user[0].user_id,
              username: user[0].username,
              user_role: user[0].user_role,
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
          return next(error);
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

  // Test Route
  router.post("/test_route", (req, res) => {
    const result = UserModel.findUserByEmail();
  });
};
