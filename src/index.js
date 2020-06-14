const express = require("express");
const app = express();
const port = 5000;


// Server Testing End Point
app.get("/", (req, res) => res.send("Ayubowan! UCSC E-Procurement I'm Working"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
