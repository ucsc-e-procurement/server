const db = require("./mysql").pool;

// Get procurements
const getProcurements = () => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement INNER JOIN product_requisition ON product_requisition.requisition_id = procurement.requisition_id`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        console.log(sqlQueryString, results, fields);
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

// Get Product Requisition Requests
const getRequisitionRequests = () => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT product_requisition.*, employee.* FROM product_requisition
                              INNER JOIN employee ON
                              product_requisition.head_of_division_id = employee.employee_id
                              WHERE product_requisition.director_id IS NULL AND product_requisition.deputy_bursar_id IS NOT NULL`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        console.log(sqlQueryString, results, fields);
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

// Get Product Requisition
const getRequisition = (reqId, status = true) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT * FROM product_requisition WHERE requisition_id = '${reqId}'`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        console.log(sqlQueryString, results, fields);
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

// Get Procurement*
const getProcurement = (reqId, status = true) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT procurement.*, product_requisition.*, employee.*, 
        CONCAT('[',GROUP_CONCAT(CONCAT('{"prod_id":"',product.product_id,'","product_name":"',product.product_name,'","prod_desc":"',product.description,'"}')),']') AS products 
        FROM procurement 
        INNER JOIN product_requisition 
        ON procurement.requisition_id = product_requisition.requisition_id 
        INNER JOIN requisition_product
        ON product_requisition.requisition_id = requisition_product.requisition_id
        INNER JOIN product 
        ON requisition_product.product_id = product.product_id
        INNER JOIN employee 
        ON employee.employee_id = product_requisition.head_of_division_id
        WHERE procurement.procurement_id = '${reqId}'`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        console.log(sqlQueryString, results, fields);
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

// Approve Product Requisition
const approveRequisition = (reqId, remarks, directorId, status = true) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `UPDATE product_requisition SET director_remarks = '${remarks}', director_id = '${directorId}' WHERE requisition_id = '${reqId}'`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        console.log(sqlQueryString, results, fields);
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

// Get Employees*
const getEmployees = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM employee`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Tech Team

const getTechTeam = (techTeamId, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM employee INNER JOIN tec_emp
                            ON tec_emp.employee_id = employee.employee_id
                            WHERE tec_emp.tec_team_id = '${techTeamId}';`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Appoint Tech Team*
const appointTechTeam = (techTeamId, procurementId, directorId, employees, status = true) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      var date = new Date()
  
      // SQL Query
      const sqlQueryString = `INSERT INTO tec_team VALUES ('${techTeamId}', '${date}', '${directorId}')`;
      const sqlQueryString2 = `UPDATE procurement SET tec_team_id = '${techTeamId}', stepper = 4 WHERE procurement_id = '${procurementId}' `;
      const sqlQueryString3 = "INSERT INTO tec_emp VALUES ?";

      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        console.log(sqlQueryString, results, fields);
        // resolve(JSON.parse(JSON.stringify(results)));
        if(error){
          connection.release();
          console.log(JSON.stringify(error));
        }else{
          db.query(sqlQueryString2, (error, results, fields) => {
            console.log(sqlQueryString2, results, fields);
            if(error){
              connection.release();
              console.log(JSON.stringify(error));
            }else{
              db.query(sqlQueryString3, [employees], (error, results, fields) => {
                connection.release();
                console.log(sqlQueryString3, results, fields);
                resolve(JSON.parse(JSON.stringify(results)));
              });
            }
          });
        }
      });
    });
});

// Get Bid Opening Team
const getBidOpeningTeam = (bidOpeningTeamId, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM employee 
                            INNER JOIN bid_opening_team ON
                            employee.employee_id = bid_opening_team.member_1 OR employee.employee_id = bid_opening_team.member_2  
                            WHERE bid_opening_team.bid_opening_team_id = '${bidOpeningTeamId}';`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Employees not in Tec Team
const getEmployeesNotInTecTeam = (tecTeamId, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM employee 
                            WHERE employee_id NOT IN
                            (SELECT employee_id FROM tec_emp WHERE tec_team_id = '${tecTeamId}')`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Appoint Bid Opening Team*
const appointBidOpeningTeam = (bidOpeningTeamId, procurementId, directorId, member1, member2, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    var date = new Date()

    // SQL Query
    const sqlQueryString = `INSERT INTO bid_opening_team VALUES('${bidOpeningTeamId}', '2020-02-20', '${member1}', '${member2}', '${directorId}');`;
    const sqlQueryString2 = `UPDATE procurement SET bid_opening_team_id = '${bidOpeningTeamId}', stepper = 5 WHERE procurement_id = '${procurementId}'`;
    
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      console.log(sqlQueryString, results, fields);

      if(error){
        connection.release();
        console.log(JSON.stringify(error));
      }else{
        db.query(sqlQueryString2, (error, results, fields) => {
          connection.release();
          console.log(sqlQueryString, results, fields);
          resolve(JSON.parse(JSON.stringify(results)));
        });
      }
    });
  });
});

// Get Approved Requisitions
const getApprovedRequisitions = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT product_requisition.*, employee.*,
                            CONCAT('[',GROUP_CONCAT(CONCAT('{"prod_id":"',product.product_id,'","product_name":"',product.product_name,'","prod_desc":"',product.description,'"}')),']') AS products
                            FROM product_requisition
                            INNER JOIN employee ON
                            product_requisition.head_of_division_id = employee.employee_id
                            INNER JOIN requisition_product
                            ON product_requisition.requisition_id = requisition_product.requisition_id
                            INNER JOIN product 
                            ON requisition_product.product_id = product.product_id
                            WHERE product_requisition.director_id IS NOT NULL AND
                            product_requisition.requisition_id NOT IN 
                            (SELECT requisition_id FROM procurement)`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

module.exports = {
    getProcurements,
    getRequisitionRequests,
    getRequisition,
    getProcurement,
    approveRequisition,
    getEmployees,
    appointTechTeam,
    appointBidOpeningTeam,
    getTechTeam,
    getBidOpeningTeam,
    getEmployeesNotInTecTeam,
    getApprovedRequisitions
};
