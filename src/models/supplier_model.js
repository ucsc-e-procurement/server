const db = require("./mysql").pool;
const bcrypt = require("bcrypt");
const { resolve } = require("path");

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
      // console.log(results)
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
      // console.log(results)
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
        rfq.*, procurement.procurement_id, procurement.category, procurement.status AS procurement_status, procurement.bid_opening_date, bid.total_with_vat, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', bid_product.product_id,'", "product_name":"', product.product_name, ' ", "qty":"', bid_product.quantity, '", "unit_price":"', bid_product.unit_price,'"}')), ']') AS bids
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
      // console.log(results)
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
        rfq.*, procurement.procurement_id, procurement.category, procurement.status AS procurement_status, procurement.bid_opening_date, procurement.completed_date, bid.total_with_vat, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', bid_product.product_id,'", "product_name":"', product.product_name, ' ", "qty":"', bid_product.quantity, '", "unit_price":"', bid_product.unit_price,'"}')), ']') AS bids
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
      // console.log(results)
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Check if supllier exists before registering
const checkExistingSupplier = (username) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `SELECT * FROM user WHERE username='${username}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get last user_id from database
const getLastID = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = "SELECT MAX(user_id) AS lastID FROM user";
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results);
    });
  });
});

// Save user
const registerSupplier = (data, userId) => new Promise(async (resolve, reject) => {
  const hash = await bcrypt.hash(data.password, 10);
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `INSERT INTO user VALUES ('${userId}', '${data.email}', '${hash}', 'supplier')`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Save supplier information
const saveSupplierInfo = (data, userId, supplierId) => new Promise(async (resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `INSERT INTO supplier VALUES ('${supplierId}', '${data.body.name}', '${data.body.address}', '${data.body.contact}', '${data.body.categories}', '${data.body.email}', 'processing', '${userId}', '${data.files.image}')`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Save price schedule data
const enterSupplierBid = (data) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `INSERT INTO bid VALUES ('bid0001', 'this is for bid0001', 'locked', '${data.subtotal}', '${data.total_with_vat}', 'processing', '${data.supplier_id}', '${data.procurement_id}', '${data.vat_no}', '${data.authorized}')`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Save bid products of a single bid
const saveBidProducts = (items) => new Promise((resolve, reject) => {
  console.log(items);
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    for (const index in items) {
      const sqlQueryString = `INSERT INTO bid_product VALUES ('bid0001', '${items[index].prod_id}', '${items[index].qty}', '${items[index].figures}', '${items[index].vat}', '${items[index].make}', '${items[index].date}', '${items[index].validity}', '${items[index].credit}')`;
      db.query(sqlQueryString);
    }
    connection.release();
    resolve();
  });
});

// Get Employee Details By UserID
const getSupplierByUserId = (userId) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT supplier_id, name, address, email, contact_number, category FROM supplier  WHERE user_id='${userId}'`;
    console.log("Query: ", sqlQueryString);
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results[0]);
    });
  });
});

module.exports = {
  checkExistingSupplier,
  getLastID,
  registerSupplier,
  saveSupplierInfo,
  enterSupplierBid,
  saveBidProducts,
  getSupplierData,
  getNewRequests,
  getOngoingProcurements,
  getCompletedProcurements,
  getSupplierByUserId,
};
