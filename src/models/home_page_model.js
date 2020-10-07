const db = require("./mysql").pool;

// Database Model Health Check - Development Purposes Only
const testUserModel = () => new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) reject(err);
      db.query();
    });
});

// Get ongoing List
const getOngoingProcurements = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT procurement_id, category, date_format(bid_opening_date,'%D %M %Y') as bid_opening_date 
                            FROM procurement
                            WHERE status = 'on-going'`
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get ongoing procurements data
const getOngoingProcurementsData = (procurementId) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      // SQL Query
      const sqlQueryString = `SELECT DISTINCT
      procurement.procurement_id,date_format(procurement.bid_opening_date,'%D %M %Y') as bid_opening_date, date_format(procurement.expiration_date,'%D %M %Y') as expiration_date, procurement.status AS procurement_status,
      CONCAT('[',GROUP_CONCAT(CONCAT('{"bid_id":"', bid.bid_id,'", "supplier_id":"', supplier.supplier_id,'", "supplier_name":"', supplier.name, '", "supplier_address":"', supplier.address,'","product_id":"',product.product_id,'","product_name":"',product.product_name,'","qty":"',bid_product.quantity,'","unit_price":"',bid_product.unit_price, ' ", "total_with_vat":"', bid.total_with_vat,'", "bid_status":"', bid.status,'"}')), ']') AS bids
      FROM procurement 
      LEFT JOIN bid ON procurement.procurement_id = bid.procurement_id
      LEFT JOIN bid_product ON bid.bid_id = bid_product.bid_id
      LEFT JOIN product ON product.product_id = bid_product.product_id
      LEFT JOIN supplier ON bid.supplier_id = supplier.supplier_id
      WHERE bid.procurement_id = '${procurementId}'
      GROUP BY bid.procurement_id`;

                            
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        console.log(sqlQueryString, results, fields);
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });

module.exports = {
    getOngoingProcurements,
    getOngoingProcurementsData
};