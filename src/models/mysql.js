const mysql = require("mysql");
const config = require("../config");

// Query-wise Connection Method
const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
});

// If Connection Pooling is needed, use this approach instead
const pool = mysql.createPool({
  connectionLimit: config.database.connection_limit,
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
});

module.exports = {
  connection,
  pool,
};
