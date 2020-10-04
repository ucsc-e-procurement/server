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

// If Connection Pooling is needed, use this approach instead
// const pool = mysql.createPool({
//   host: "testdb-1.cezlzfckdvnf.ap-south-1.rds.amazonaws.com",
//   user: "root",
//   password: "ucsc1234",
//   database: "ucsc_e_proc",
//   connectionLimit: 100,
// });

// localhost
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// aws
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: process.env.DATABASE_CONNECTION_LIMIT,
});

module.exports = {
  connection,
  pool,
};
