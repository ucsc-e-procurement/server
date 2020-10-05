/* eslint-disable linebreak-style */
const express = require("express");
const passport = require("passport");

const router = express.Router();
// const middlewares = require('../middlewares');
const jwt = require("jsonwebtoken");
require("../../config/passport_config");

const { use } = require("passport");
const UserModel = require("../../models/user_model");
const logger = require("../../config/winston_config");

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
    logger.info("User Login Invoked");
    console.log(req.body);
    if (req.body.email === "" || req.body.password === "") {
      res.status(400).json({
        error: {
          code: 1001,
          message: "Empty Email or Password Found",
          description: "",
        },
      });
      return;
    }
    try {
      passport.authenticate("login", async (err, user, info) => {
        try {
          if (err || !user) {
            console.log("==================", user, err);
            res.status(400).json({
              error: {
                code: 1002,
                message: "Invalid User",
                description: `There is no user matching for the user_id: ${req.body.email} or Incorrect Password`,
              },
            });
            return;
          }
          req.login(user, { session: false }, async (error) => {
            if (error) {
              res.status(400).json({
                error: {
                  code: 1002,
                  message: "Authentication Failled",
                  description: error,
                },
              });
              return;
            }

            const body = {
              ...user,
            };

            // Sign the JWT token and populate the payload with the user email and id
            const token = jwt.sign({ user: body }, "top_secret_key_here");

            // Send back the token to the user(Client Side)
            res.status(200).json({
              token,
            });
          });
        } catch (error) {
          res.status(400).json({
            error: {
              code: 1003,
              message: "Authentication Failled",
              description: error,
            },
          });
        }
      })(req, res, next);
    } catch (error) {
      res.status(400).json({
        error: {
          code: 1004,
          message: "Authentication Failled",
          description: error,
        },
      });
    }
  });
};
