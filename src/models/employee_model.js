const db = require("./mysql").pool;

// Get Employee Details By UserID
const getEmployeeByUserId = (userId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT employee.employee_id, employee.name, employee.department, employee.email FROM employee  WHERE employee.user_id='${userId}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results[0]);
    });
  });
});

// Get Employee Details By Employee ID
const getEmployeeByEmployeeId = (employeeId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT employee.employee_id, employee.name, employee.department, employee.email FROM employee  WHERE employee.employee_id='${employeeId}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results[0])));
    });
  });
});

// ######################################################################################################################################################
//                                                 Create New Employee
// ######################################################################################################################################################
const createEmployee = (employeeData) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `INSERT INTO employee(employee_id, name, department, email, user_id) VALUES('${employeeData.employee_id}', '${employeeData.name}', '${employeeData.division}', '${employeeData.email}', '${employeeData.email}')`;
    db.query(sqlQueryString, (error, results, fields) => {
      if (error) reject(error);

      // Release SQL Connection Back to the Connection Pool
      connection.release();

      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

module.exports = {

  getEmplyeeByUserId: getEmployeeByUserId,
  getEmployeeByEmployeeId,
  createEmployee

};
