const mysql = require("mysql");
const config = require("../config");

// Query-wise Connection Method
// const connection = mysql.createConnection({
//   host: config.database.host,
//   user: config.database.user,
//   password: "",
//   database: config.database.name,
// });

// aws
// const connection = mysql.createConnection({
//   host: "testdb-1.cezlzfckdvnf.ap-south-1.rds.amazonaws.com",
//   user: "root",
//   password: "ucsc1234",
//   database: "ucsc_e_proc",
// });

// // If Connection Pooling is needed, use this approach instead
// const pool = mysql.createPool({
//   host: "testdb-1.cezlzfckdvnf.ap-south-1.rds.amazonaws.com",
//   user: "root",
//   password: "ucsc1234",
//   database: "ucsc_e_proc",
//   connectionLimit: 100,
// });

// localhost
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ucsc_e_proc",
});

// If Connection Pooling is needed, use this approach instead
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ucsc_e_proc",
  connectionLimit: 100,
});

module.exports = {
  connection,
  pool,
};
