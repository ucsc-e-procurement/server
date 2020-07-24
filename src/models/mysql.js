const mysql = require("mysql");
const config = require("../config");

// Query-wise Connection Method
// const connection = mysql.createConnection({
//   host: config.database.host,
//   user: config.database.user,
//   password: "",
//   database: config.database.name,
// });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "UCSC_E_PROC",
});

// If Connection Pooling is needed, use this approach instead
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "UCSC_E_PROC",
  connectionLimit: 100,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {
  connection,
  pool,
};
