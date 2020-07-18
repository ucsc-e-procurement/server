const db = require("./mysql").pool;

// Get procurements
const getProcurements = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT procurement.*, 
                              requisition.description, requisition.date, requisition.procurement_type, requisition.fund_type, requisition.division
                              FROM procurement INNER JOIN requisition ON requisition.requisition_id = procurement.requisition_id`;
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
    const sqlQueryString = `SELECT requisition.*, employee.*,
                              CONCAT('[',CONCAT(CONCAT('{"prod_id":"',product.product_id,'","product_name":"',product.product_name,'","prod_desc":"',product.description,'","prod_qty":"',requisition_product.quantity,'"}')),']') AS products 
                              FROM requisition
                              INNER JOIN employee ON
                              requisition.head_of_division_id = employee.employee_id
                              INNER JOIN requisition_product ON
                              requisition.requisition_id = requisition_product.requisition_id
                              INNER JOIN product ON
                              product.product_id = requisition_product.product_id
                              WHERE requisition.director_recommendation IS NULL AND requisition.deputy_bursar_recommendation = 'Recommended'`;
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
    const sqlQueryString = `SELECT * FROM requisition WHERE requisition_id = '${reqId}'`;
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
    const sqlQueryString = `SELECT procurement.*, requisition.*, employee.*, 
        CONCAT('[',GROUP_CONCAT(CONCAT('{"prod_id":"',product.product_id,'","product_name":"',product.product_name,'","prod_desc":"',product.description,'","prod_qty":"',requisition_product.quantity,'"}')),']') AS products 
        FROM procurement 
        INNER JOIN requisition 
        ON procurement.requisition_id = requisition.requisition_id 
        INNER JOIN requisition_product
        ON requisition.requisition_id = requisition_product.requisition_id
        INNER JOIN product 
        ON requisition_product.product_id = product.product_id
        INNER JOIN employee 
        ON employee.employee_id = requisition.head_of_division_id
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
const approveRequisition = (reqId, directorRemarks, directorRecommendation, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `UPDATE requisition SET director_remarks = '${directorRemarks}', director_recommendation = '${directorRecommendation}' WHERE requisition_id = '${reqId}'`;
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
    const sqlQueryString = "SELECT * FROM employee";
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Tech Team*

const getTechTeam = (techTeamId, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT CONCAT('[',GROUP_CONCAT(CONCAT('{"employee_id":"',employee.employee_id,'","employee_name":"',employee.name,'","capacity":"',tec_emp.capacity,'"}')),']') AS team
                            FROM employee INNER JOIN tec_emp
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

// Get max tec id
const getMaxTecTeamId = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = "SELECT MAX(tec_team_id) AS maxTecId FROM tec_team";
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Appoint Tech Team*
const appointTechTeam = (procurementId, directorId, employees, chairman, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    const date = new Date();

    // SQL Query
    const sqlQueryString = `INSERT INTO tec_team(appointed_date, appointed_by, chairman) VALUES ('${date}', '${directorId}', '${chairman}')`;

    const sqlQueryString3 = "INSERT INTO tec_emp VALUES ?";

    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      console.log(sqlQueryString, results, fields);
      // resolve(JSON.parse(JSON.stringify(results)));
      if (error) {
        connection.release();
        console.log(JSON.stringify(error));
      } else {
        const techId = results.insertId;

        const sqlQueryString2 = `UPDATE procurement SET tec_team_id = '${results.insertId}', step = 4 WHERE procurement_id = '${procurementId}' `;

        db.query(sqlQueryString2, (error, results, fields) => {
          console.log(sqlQueryString2, results, fields);
          if (error) {
            connection.release();
            console.log(JSON.stringify(error));
          } else {
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

// Max Bid Opening Team Id
const getMaxBidTeamId = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = "SELECT MAX(bid_opening_team_id) AS maxBidTeamId FROM bid_opening_team";
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
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
const appointBidOpeningTeam = (procurementId, directorId, member1, member2, bidTeamId, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    const date = new Date();

    // SQL Query
    const sqlQueryString = `INSERT INTO bid_opening_team VALUES('${bidTeamId}', '2020-02-20', '${member1}', '${member2}', '${directorId}');`;
    const sqlQueryString2 = `UPDATE procurement SET bid_opening_team_id = '${bidTeamId}', step = 5 WHERE procurement_id = '${procurementId}'`;

    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      console.log(sqlQueryString, results, fields);

      if (error) {
        connection.release();
        console.log(JSON.stringify(error));
      } else {
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
    const sqlQueryString = `SELECT requisition.*, employee.*,
                            CONCAT('[',CONCAT(CONCAT('{"prod_id":"',product.product_id,'","product_name":"',product.product_name,'","prod_desc":"',product.description,'", "prod_qty":"',requisition_product.quantity,'"}')),']') AS products
                            FROM requisition
                            INNER JOIN employee ON
                            requisition.head_of_division_id = employee.employee_id
                            INNER JOIN requisition_product
                            ON requisition.requisition_id = requisition_product.requisition_id
                            INNER JOIN product 
                            ON requisition_product.product_id = product.product_id
                            WHERE requisition.director_recommendation = 'Approved' AND
                            requisition.requisition_id NOT IN 
                            (SELECT requisition_id FROM procurement)`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get RFQ Details
const getRfqDetails = (procurementId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM rfq INNER JOIN supplier
                            ON rfq.supplier_id = supplier.supplier_id
                            WHERE rfq.procurement_id = '${procurementId}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Recent Products 
const getRecentProducts = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM product INNER JOIN bid_product
                            ON product.product_id = bid_product.product_id INNER JOIN bid
                            ON bid.bid_id = bid_product.bid_id WHERE
                            bid.status = 'approved' ORDER BY bid.bid_id DESC`;
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
  getApprovedRequisitions,
  getMaxTecTeamId,
  getMaxBidTeamId,
  getRfqDetails,
  getRecentProducts
};
