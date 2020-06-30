const db = require("./mysql").pool;

const getSupplierData = (supplier_id) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM supplier WHERE supplier_id='${supplier_id}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      //console.log(results)
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

const getNewRequests = (supplier_id) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT rfq.*, procurement.procurement_id, procurement.category, CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', rfq_product.product_id,'", "product_name":"', product.product_name, ' ", "qty":"', rfq_product.quantity,'"}')), ']') AS products 
        FROM rfq 
        INNER JOIN procurement ON rfq.procurement_id = procurement.procurement_id 
        INNER JOIN rfq_product ON rfq.rfq_id = rfq_product.rfq_id 
        INNER JOIN product ON rfq_product.product_id = product.product_id 
        WHERE rfq.supplier_id='${supplier_id}' AND rfq.status='sent'
        GROUP BY rfq.rfq_id`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        //console.log(results)
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
});

const getOngoingProcurements = (supplier_id) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT DISTINCT
        rfq.*, procurement.procurement_id, procurement.category, procurement.status AS procurement_status, procurement.bid_opening_date, bid.quotation, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', bid_product.product_id,'", "product_name":"', product.product_name, ' ", "qty":"', bid_product.quantity, '", "price":"', bid_product.price,'"}')), ']') AS bids
        FROM rfq 
        INNER JOIN procurement ON rfq.procurement_id = procurement.procurement_id 
        INNER JOIN bid ON procurement.procurement_id = bid.procurement_id
        INNER JOIN bid_product ON bid.bid_id = bid_product.bid_id
        INNER JOIN product ON bid_product.product_id = product.product_id
        WHERE rfq.supplier_id='${supplier_id}' AND rfq.status='accepted' AND procurement.status='on-going' AND bid.supplier_id='${supplier_id}'
        GROUP BY bid.bid_id`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      //console.log(results)
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

const getCompletedProcurements = (supplier_id) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT DISTINCT
        rfq.*, procurement.procurement_id, procurement.category, procurement.status AS procurement_status, procurement.bid_opening_date, procurement.completed_date, bid.quotation, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', bid_product.product_id,'", "product_name":"', product.product_name, ' ", "qty":"', bid_product.quantity, '", "price":"', bid_product.price,'"}')), ']') AS bids
        FROM rfq 
        INNER JOIN procurement ON rfq.procurement_id = procurement.procurement_id 
        INNER JOIN bid ON procurement.procurement_id = bid.procurement_id
        INNER JOIN bid_product ON bid.bid_id = bid_product.bid_id
        INNER JOIN product ON bid_product.product_id = product.product_id
        WHERE rfq.supplier_id='${supplier_id}' AND rfq.status='accepted' AND procurement.status='completed' AND bid.supplier_id='${supplier_id}'
        GROUP BY bid.bid_id`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      //console.log(results)
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

module.exports = {
    getSupplierData,
    getNewRequests,
    getOngoingProcurements,
    getCompletedProcurements
};
  