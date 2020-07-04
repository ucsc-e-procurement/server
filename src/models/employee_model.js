const db = require("./mysql").pool;

// Get Employee Details By UserID
const getEmplyeeByUserId = (userId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT employee.employee_id, employee.name, employee.department, employee.email FROM employee INNER JOIN emp_role ON employee.employee_id = emp_role.employee_id  WHERE employee.user_id='${userId}'`;
    console.log("Query: ", sqlQueryString);
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results[0]);
    });
  });
});

module.exports = {

  getEmplyeeByUserId,

};
