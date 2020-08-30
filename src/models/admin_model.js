const db = require("./mysql").pool;

// Database Model Health Check - Development Purposes Only
const testUserModel = () => new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) reject(err);
      db.query();
    });
});

// Get Direct ongoing procurement List
const getDirectOngoingProcurements = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT procurement.procurement_id, procurement.category 
                            FROM procurement
                            INNER JOIN requisition ON procurement.requisition_id = requisition.requisition_id
                            WHERE procurement.step = 3 AND requisition.director_recommendation = 'Approved' AND procurement.procurement_method = 'direct'`
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get Shopping ongoing procurement List
const getShoppingOngoingProcurements = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT procurement.procurement_id, procurement.category 
                            FROM procurement
                            INNER JOIN requisition ON procurement.requisition_id = requisition.requisition_id
                            WHERE procurement.step = 3 AND requisition.director_recommendation = 'Approved' AND procurement.procurement_method = 'shopping'`
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get list of suppliers
const getSupplierList = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT *
                            FROM supplier
                            WHERE status = 'active'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Send RFQ in direct ongoing procurements
const sendRFQDirectOngoingProcurements = (supplierId,procurementId,date,deadline) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `INSERT INTO rfq VALUES('rfq12', 'rfq11', 'sent', '${deadline}' , '${procurementId}', '${supplierId}', '${date}');`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

module.exports = {
    getDirectOngoingProcurements,
    getShoppingOngoingProcurements,
    getSupplierList,
    sendRFQDirectOngoingProcurements,
  };