const db = require("./mysql").pool;

// ######################################################################################################################################################
//                                           Database Model Health Check - Development Purposes Only
// ######################################################################################################################################################
const testUserModel = () => new Promise((resolve, reject) => {
  db.connect((err) => {
    if (err) reject(err);
    db.query();
  });
});
// ######################################################################################################################################################
//                                           Find A User By Email and Password
// ######################################################################################################################################################
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
// ######################################################################################################################################################
//                                            Find A User By Email
// ######################################################################################################################################################
const findUserByEmail = (userId, status = 0) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM user WHERE user_id='${userId}' AND status=${status}`;
    db.query(sqlQueryString, (error, results) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();

      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});
// ######################################################################################################################################################
//                                              Get All Users
// ######################################################################################################################################################
const getUsers = (status = 0) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT user_id, user_role, status FROM user WHERE status=${status}`;
    db.query(sqlQueryString, (error, results, fields) => {
      if (error) reject(error);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});
// ######################################################################################################################################################
//                                                Update User Status
// ######################################################################################################################################################
const updateUserStatus = (userId, status) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `UPDATE user SET status=${status} WHERE user_id='${userId}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      if (error) reject(error);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});
// ######################################################################################################################################################
//                                                 Get User Roles
// ######################################################################################################################################################
const getUserRoles = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = "SELECT * FROM role";
    db.query(sqlQueryString, (error, results, fields) => {
      if (error) reject(error);

      // Release SQL Connection Back to the Connection Pool
      connection.release();

      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});
// ######################################################################################################################################################
//                                                 Get Last Record From Employee Table
// ######################################################################################################################################################
const getLastEmployeeRecord = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = "SELECT * FROM employee ORDER BY employee_id DESC LIMIT 1";
    db.query(sqlQueryString, (error, results, fields) => {
      if (error) reject(error);

      // Release SQL Connection Back to the Connection Pool
      connection.release();

      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});
// ######################################################################################################################################################
//                                                 Create New User / Employee
// ######################################################################################################################################################
const createUser = (userData) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `INSERT INTO user(user_id, password, user_role, status) VALUES('${userData.user_id}', '${userData.password}', '${userData.user_role}', 0)`;
    db.query(sqlQueryString, (error, results, fields) => {
      if (error) reject(error);

      // Release SQL Connection Back to the Connection Pool
      connection.release();

      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});
// ######################################################################################################################################################
//                                                                     Exports
// ######################################################################################################################################################
module.exports = {
  testUserModel,
  findUserByEmailAndPassword,
  findUserByEmail,
  getUsers,
  updateUserStatus,
  getUserRoles,
  getLastEmployeeRecord,
  createUser
};
