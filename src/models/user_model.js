const db = require("./mysql").pool;

// Database Model Health Check - Development Purposes Only
const testUserModel = () => new Promise((resolve, reject) => {
  db.connect((err) => {
    if (err) reject(err);
    db.query();
  });
});

// Find A User By Email and Password
const findUserByEmailAndPassword = (username, password, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM user WHERE user_id='${username}' AND password='${password}'`;

    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results);
    });
  });
});

// Find A User By Email
const findUserByEmail = (userId, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM user WHERE user_id='${userId}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Find A User By Email
const getUsers = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = "SELECT user_id, user_role, status FROM user";
    db.query(sqlQueryString, (error, results, fields) => {
      if (error) reject(error);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

module.exports = {
  testUserModel,
  findUserByEmailAndPassword,
  findUserByEmail,
  getUsers,
};
