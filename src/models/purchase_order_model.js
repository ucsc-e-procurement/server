const db = require("./mysql").pool;

// Database Model Health Check - Development Purposes Only
const testUserModel = () => new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) reject(err);
      db.query();
    });
});

// Get PO data
const getPurchaseOrderData = () => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      // SQL Query
      const sqlQueryString = `SELECT bid_product.unit_price, bid_product.quantity, bid_product.make
                              FROM bid_product
                              INNER JOIN bid ON bid.bid_id = bid_product.bid_id
                              WHERE bid.procurement_id = 'UCSC/DIM/G/ENG/2020/0000001'`;
      db.query(sqlQueryString, (error, results, fields) => {
        console.log(error, results);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

module.exports = {
    getPurchaseOrderData
};