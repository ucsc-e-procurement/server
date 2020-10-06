const { promises } = require("fs");

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

// Get Tec Appointment Requests 
const getTecAppointmentRequests = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM procurement WHERE status = 'on-going' AND step = 3`;
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
    const sqlQueryString = `UPDATE requisition SET director_remarks = '${directorRemarks}', director_recommendation = '${directorRecommendation}', director_id = 'emp00001' WHERE requisition_id = '${reqId}'`;
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
    const sqlQueryString = `SELECT employee.*, grouped.assigned FROM employee LEFT JOIN 
                            (SELECT CONCAT('[',GROUP_CONCAT(CONCAT('{"procurement_id":"',procurement.procurement_id,'","capacity":"',tec_emp.capacity,'",  "date":"',procurement.bid_opening_date,'"}')),']') AS assigned, 
                            tec_emp.employee_id FROM tec_emp  
                            INNER JOIN procurement on procurement.tec_team_id = tec_emp.tec_team_id 
                            WHERE procurement.status = "on-going" 
                            GROUP by tec_emp.employee_id) AS grouped ON 
                            employee.employee_id = grouped.employee_id `;
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

    const date = new Date().toJSON().slice(0, 10);

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
                            ON bid.bid_id = bid_product.bid_id INNER JOIN supplier 
                            ON supplier.supplier_id = bid.supplier_id WHERE
                            bid.status = 'approved' ORDER BY bid.bid_id DESC`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Supplier List 
const getSuppliers = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM supplier WHERE status = 'active'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Supplier Details 
const getSupplierDetails = (supplierId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT supplier.*, 
                            CONCAT('[',GROUP_CONCAT(CONCAT('{"procurementId":"',procurement.procurement_id,'","status":"',procurement.status,'","step":"',procurement.step,'","prod_desc":"',requisition.description,'","bidStatus":"',bid.status,'","procurement_method":"',procurement.procurement_method,'"}')),']') AS procurements
                            FROM supplier LEFT JOIN bid ON
                            supplier.supplier_id = bid.supplier_id
                            LEFT JOIN procurement ON 
                            bid.procurement_id = procurement.procurement_id
                            LEFT JOIN requisition ON
                            procurement.requisition_id = requisition.requisition_id
                            WHERE supplier.supplier_id = '${supplierId}' AND bid.status = 'approved'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Department List 
const getDepartments = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT employee.name, employee.department FROM employee INNER JOIN user ON employee.user_id = user.user_id WHERE
                            user.user_role = 'HOD'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Department Details 
const getDepartmentDetails = (department) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT CONCAT('[',GROUP_CONCAT(CONCAT('{"procurementId":"',procurement.procurement_id,'","status":"',procurement.status,'","step":"',procurement.step,'","prod_desc":"',requisition.description,'","procurement_method":"',procurement.procurement_method,'"}')),']') AS procurements
                            FROM procurement INNER JOIN requisition ON
                            procurement.requisition_id = requisition.requisition_id
                            INNER JOIN employee ON requisition.head_of_division_id = employee.employee_id
                            WHERE employee.department = '${department}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Advanced Search 
const advancedSearch = (department, procurementStatus, procurementType, supplier, from, to) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if(err){
      reject(err);
      return;
    }

    var sqlQueryString;

    if(supplier){
      sqlQueryString = `SELECT CONCAT('[',GROUP_CONCAT(CONCAT('{"procurementId":"',procurement.procurement_id,'","status":"',procurement.status,'","step":"',procurement.step,'","prod_desc":"',requisition.description,'","bidStatus":"',bid.status,'","procurement_method":"',procurement.procurement_method,'"}')),']') AS procurements
            FROM supplier LEFT JOIN bid ON
            supplier.supplier_id = bid.supplier_id
            LEFT JOIN procurement ON 
            bid.procurement_id = procurement.procurement_id
            LEFT JOIN requisition ON
            procurement.requisition_id = requisition.requisition_id
            INNER JOIN employee ON requisition.head_of_division_id = employee.employee_id
            WHERE supplier.supplier_id = '${supplier}' AND bid.status = 'approved' AND employee.department LIKE '${department}%' AND procurement.status LIKE '${procurementStatus}%'
            AND procurement.procurement_method LIKE '${procurementType}%' AND procurement.completed_date BETWEEN '${from}' AND '${to}'`;
    }else{
      sqlQueryString = `SELECT CONCAT('[',GROUP_CONCAT(CONCAT('{"procurementId":"',procurement.procurement_id,'","status":"',procurement.status,'","step":"',procurement.step,'","prod_desc":"',requisition.description,'","procurement_method":"',procurement.procurement_method,'"}')),']') AS procurements
      FROM procurement INNER JOIN requisition ON
      procurement.requisition_id = requisition.requisition_id
      INNER JOIN employee ON requisition.head_of_division_id = employee.employee_id
      WHERE employee.department LIKE '${department}%' AND procurement.status LIKE '${procurementStatus}%'
      AND procurement.procurement_method LIKE '${procurementType}%' AND procurement.bid_opening_date BETWEEN '${from}' AND '${to}'`;
    }

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
  getRecentProducts,
  getTecAppointmentRequests,
  getSuppliers,
  getSupplierDetails,
  getDepartments,
  getDepartmentDetails,
  advancedSearch
};
