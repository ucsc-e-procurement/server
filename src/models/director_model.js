const db = require("./mysql").pool;

// Get procurements
const getProcurements = () => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
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
      const sqlQueryString = `SELECT * FROM product_requisition WHERE director_id IS NULL AND deputy_bursar_id IS NOT NULL`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
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
      const sqlQueryString = `SELECT * FROM procurement WHERE procurement_id = '${reqId}'`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
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
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        console.log(sqlQueryString, results, fields);
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

// Appoint Bid Opening Team*
const appointBidOpeningTeam = (bidOpeningTeamId, directorId, member1, member2, status = true) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    var date = new Date()

    // SQL Query
    const sqlQueryString = `INSERT INTO bid_opening_team VALUES('${bidOpeningTeamId}', '2020-02-20', '${member1}', '${member2}', '${directorId}');`;
    
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      console.log(sqlQueryString, results, fields);
      connection.release();
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
    appointTechTeam,
    appointBidOpeningTeam
};
