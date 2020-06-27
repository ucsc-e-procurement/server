/* eslint-disable linebreak-style */
const express = require('express');
const passport = require('passport');

const router = express.Router();
// const middlewares = require('../middlewares');

module.exports = (app) => {
  app.use('/auth', router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get('', (req, res) => {
    res.send("Ayubowan! from Auth Routes, I'm Working").status(200).end();
  });

  router.post('/login', passport.authenticate('local'),
    (req, res) => {
      // res.send("Ayubowan! from Auth Routes -> Login, I'm Working").status(200).end();

      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect(`/users/${req.user.username}`);
    });
};
