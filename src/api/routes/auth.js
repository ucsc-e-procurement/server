/* eslint-disable linebreak-style */
const express = require("express");
const passport = require("passport");

const router = express.Router();
// const middlewares = require('../middlewares');
const jwt = require("jsonwebtoken");
require("../../config/passport_config");

module.exports = (app) => {
  app.use("/auth", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("", (req, res) => {
    res.send("Ayubowan! from Auth Routes, I'm Working").status(200).end();
  });

  router.post("/login", (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error("An Error occurred");
          return next(error);
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);
          // We don't want to store the sensitive information such as the
          // user password in the token so we pick only the email and id
          const body = { _id: user.id, username: user.username };
          // Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user: body }, "top_secret_key_here");
          // Send back the token to the user
          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });
};
