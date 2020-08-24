const db = require("./mysql").pool;

// Database Model Health Check - Development Purposes Only
const testUserModel = () => new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) reject(err);
      db.query();
    });
});

// Get PO List
const getPurchaseOrderList = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT procurement.procurement_id, procurement.category
                            FROM procurement
                            INNER JOIN bid ON bid.procurement_id = procurement.procurement_id
                            WHERE procurement.status = 'on-going' AND bid.status = 'approved' AND procurement.purchase_order = '0'
                            GROUP BY bid.procurement_id`
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});
// Generate Purchase Order
const generatePurchaseOrder = (procurementId) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      // SQL Query
      const sqlQueryString = `SELECT DISTINCT supplier.name, supplier.address,
                              CONCAT('[',GROUP_CONCAT(CONCAT('{"unit_price":"', bid_product.unit_price,'", "quantity":"', bid_product.quantity,'", "make":"', bid_product.make,'"}')), ']') AS bids
                              FROM bid
                              INNER JOIN bid_product ON bid_product.bid_id = bid.bid_id
                              INNER JOIN supplier ON supplier.supplier_id = bid.supplier_id
                              WHERE bid.procurement_id = '${procurementId}'
                              GROUP BY bid.bid_id`;
      db.query(sqlQueryString, (error, results, fields) => {
        console.log(error, results);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

module.exports = {
    generatePurchaseOrder,
    getPurchaseOrderList
};