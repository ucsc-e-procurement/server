const db = require("./mysql").pool;

// Get Employee Details By UserID
const getRequisitions = () => new Promise((resolve, reject) => {
  console.log("===========================================================");
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
    }

    // SQL Query
    const sqlQueryString = "SELECT * FROM requisition";
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results);
    });
  });
});

const getRequisitionById = (requisitionId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM requisition WHERE requisition_id='${requisitionId}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(results, error);
      if (results.length > 0) resolve(JSON.parse(JSON.stringify(results[0])));
      else resolve([]);
    });
  });
});

const getProductsByRequisitionId = (requisitionId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
    }

    console.log("RID: ", requisitionId);

    // SQL Query
    const sqlQueryString = `SELECT * FROM requisition_product INNER JOIN product ON requisition_product.product_id=product.product_id  WHERE requisition_product.requisition_id='${requisitionId}'`;
    console.log("QQQQQQQQQQQQQQQQ ", sqlQueryString);
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

module.exports = {
  getRequisitions,
  getRequisitionById,
  getProductsByRequisitionId,

};
