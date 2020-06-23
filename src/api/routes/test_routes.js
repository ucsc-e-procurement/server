const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares");

module.exports = (app) => {
    app.use("/test", router);

    // ----------------------------------------------------------------------------------------
    //                               Route Endpoints
    // ----------------------------------------------------------------------------------------

    // Health Check Route for Testing
    router.get("", (req, res) => {
        res.send("Ayubowan! from Test Routes, I'm Working").status(200).end();
    });
}
