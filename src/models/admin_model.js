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
    const sqlQueryString1 = `INSERT INTO rfq VALUES('rfq12', 'rfq12', 'sent', '${deadline}' , '${procurementId}', '${supplierId}', '${date}');`;
    // const sqlQueryString2 = `UPDATE procurement SET step = 4 WHERE procurement_id = '${procurementId}'`;

    db.query(sqlQueryString1, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      console.log(sqlQueryString1, results, fields);

      // if (error) {
      //   connection.release();
      //   console.log(JSON.stringify(error));
      // } else {
      //   db.query(sqlQueryString2, (error, results, fields) => {
      //     connection.release();
      //     console.log(sqlQueryString1, results, fields);
      //     resolve(JSON.parse(JSON.stringify(results)));
      //   });
      // }
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

// Send RFQ in shopping ongoing procurements
const sendRFQShoppingOngoingProcurements = (date,deadline,procurementId) => new Promise((resolve, reject) => {
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
      console.log(sqlQueryString, results, fields);

      for(var i = 0; i < results.length; i++){
        const sqlQueryString2 = `INSERT INTO rfq VALUES('rfq12', 'rfq12', 'sent', '${deadline}' , '${procurementId}', '${results[i].supplier_id}', '${date}');`
        console.log("hi", results[i].supplier_id)
        db.query(sqlQueryString2, (error, results, fields) => {
        })
      }
      connection.release(); 
      resolve(JSON.parse(JSON.stringify(results)));     
    });
  });
});

module.exports = {
    getDirectOngoingProcurements,
    getShoppingOngoingProcurements,
    getSupplierList,
    sendRFQDirectOngoingProcurements,
    sendRFQShoppingOngoingProcurements,
  };