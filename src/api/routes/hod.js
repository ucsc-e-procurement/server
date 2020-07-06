const express = require("express");

const router = express.Router();
//const middlewares = require("../middlewares");

// Database Models
const hodModal = require("../../models/hod_model");

module.exports = (app) => {
  app.use("/hod", router);

  // ----------------------------------------------------------------------------------------
  //                               Route Endpoints
  // ----------------------------------------------------------------------------------------

  // Health Check Route for Testing
  router.get("", (req, res) => {
    res.send("Ayubowan! from HOD Routes, I'm Working").status(200).end();
  });
  // Testing connectivity with table, get all data
  router.get("/test", (req, res) => {
    hodModal
      .get_init_all()
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  // Get initialized proc data
  router.get("/init/:empid", (req, res) => {
    hodModal
      .get_init(req.params.empid)
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  // Get approved proc data
  router.get("/approved/:empid", (req, res) => {
    hodModal
      .get_approved(req.params.empid)
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  // Get completed proc data
  router.get("/completed/:empid", (req, res) => {
    hodModal
      .get_completed(req.params.empid)
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  // Get terminated proc data
  router.get("/terminated/:empid", (req, res) => {
    hodModal
      .get_terminated(req.params.empid)
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  // Get current DIR
  router.get("/dir_empid", (req, res) => {
    hodModal
      .get_dir_empid(req.params.empid)
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  // Get current DIR
  router.get("/dir_empid", (req, res) => {
    hodModal
      .get_dir_empid()
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
        ç;
      });
  });

  // Get current DB
  router.get("/db_empid", (req, res) => {
    hodModal
      .get_db_empid()
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  // Get products
  router.get("/products", (req, res) => {
    hodModal
      .get_products()
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });

  //test create
  // router.post("/test_create_req", (req, res) => {
  //   hodModal
  //     .test_create_request(req.body)
  //     .then((result) => {
  //       res.json(result).status(200).end();
  //     })
  //     .catch((err) => {
  //       res.send(err).status(400).end();
  //     });
  // });

  router.post("/create_req", (req, res) => {
    hodModal
      .create_request(req.body)
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        res.send(err).status(400).end();
      });
  });
};
