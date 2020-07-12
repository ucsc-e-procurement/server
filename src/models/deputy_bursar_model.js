const db = require("./mysql").pool;

// Database Model Health Check - Development Purposes Only
const testUserModel = () => new Promise((resolve, reject) => {
  db.connect((err) => {
    if (err) reject(err);
    db.query();
  });
});

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

// Get product requisition list
const getProductRequisitionList = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT requisition_id, date_format(date,'%D %M %Y') as date, division FROM requisition WHERE status='I'`;
    db.query(sqlQueryString, (error, results, fields) => {
      console.log(error, results);
    // Release SQL Connection Back to the Connection Pool
    connection.release();
    resolve(JSON.parse(JSON.stringify(results)));
  });
  });
});

// Retrieve Product Requisition
const getProductRequisition = (requisitionId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT division,description,date_format(date,'%D %M %Y') as date,procurement_type FROM requisition WHERE requisition_id = '${requisitionId}'`;     
    db.query(sqlQueryString, (error, results, fields) => {
      console.log(error, results);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Approve Product Requisition
const approveRequisition = (requisitionId,selectedFundType) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `UPDATE requisition SET deputy_bursar_recommendation = 'Recommended', deputy_bursar_remarks = 'none', fund_type = '${selectedFundType}', status = 'D' WHERE requisition_id = '${requisitionId}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      console.log(sqlQueryString, results, fields);
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Deny Product Requisition
const denyRequisition = (requisitionId,remarks) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `UPDATE requisition SET deputy_bursar_recommendation = 'Denied', fund_type = 'none', deputy_bursar_remarks = '${remarks}', status = 'D' WHERE requisition_id = '${requisitionId}'`;
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
    getProductRequisitionList,
    getProductRequisition,
    approveRequisition,
    denyRequisition
};
