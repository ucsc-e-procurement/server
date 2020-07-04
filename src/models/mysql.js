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

  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,

  // host: "localhost",
  // user: "root",
  // password: "ucsc@123",
  // database: "procurement_system"
  // database: "UCSC_E_PROC",

});

//If Connection Pooling is needed, use this approach instead
const pool = mysql.createPool({

  connectionLimit: config.database.connection_limit,
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  
  // connectionLimit: 5,
  // host: "localhost",
  // user: "root",
  // password: "ucsc@123",
  // database: "UCSC_E_PROC",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {
  connection,
  pool,
};
