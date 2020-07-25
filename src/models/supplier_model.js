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

// Get pending purchase orders for supplier
const getPendingOrders = (supplier_id) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM bid 
                            WHERE supplier_id='${supplier_id}' AND status='po-sent'`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Get pending purchase orders for supplier
const getCompletedOrders = (supplier_id) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM bid 
                            WHERE supplier_id='${supplier_id}' AND status='completed'`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
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
    const sqlQueryString = `SELECT YEAR(registration_date) AS reg_year FROM registration WHERE supplier_id='${username}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve((results));
    });
  });
});

const getSupplierInfo = (username) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `SELECT * FROM supplier WHERE supplier_id='${username}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve((results));
    });
  });
})

// Save user
const registerSupplier = (email, password, state) => new Promise(async (resolve, reject) => {
  const hash = await bcrypt.hash(password, 10);
  let sqlQueryString;
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    if(state == 'new') {
      sqlQueryString = `INSERT INTO user VALUES ('${email}', '${hash}', 'SUP', '0')`;
    }
    else if(state == 'renew') {
      sqlQueryString = `UPDATE user SET password='${hash}' WHERE user_id='${email}'`;
    }
    console.log(sqlQueryString);
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Save supplier information
const saveSupplierInfo = (fields, files) => new Promise(async (resolve, reject) => {
  let sqlQueryString;
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const bufferCertCopy = Buffer.from(files.cert_copy.path)
    if(fields.user_state == 'new') {
      sqlQueryString = `INSERT INTO supplier VALUES ('${fields.email}', '${fields.contact_name}', '${fields.business_address}', 
                      '${fields.contact}', '${fields.cat_selection}', '${fields.official_email}', '${fields.legal}', '${fields.fax}', 
                      '${fields.web}', '${fields.business_reg_no}', '${bufferCertCopy}', '${fields.vat_reg_no}', '${fields.ictad_reg_no}',
                      '${fields.bank}', '${fields.branch}', '${fields.business_nature}', '${fields.business_type}', '${fields.credit_offered}',
                      '${fields.maximum_credit}', '${fields.credit_period}', '${fields.experience}', '${fields.email}')`;
    }
    else if (fields.user_state == 'renew') {
      sqlQueryString = `UPDATE supplier SET name=${fields.contact_name}', address='${fields.business_address}', 
                      contact_number='${fields.contact}', category='${fields.cat_selection}', email='${fields.official_email}', legal='${fields.legal}', fax='${fields.fax}', 
                      web='${fields.web}', business_reg'${fields.business_reg_no}', cert_copy='${bufferCertCopy}', vat_reg_no='${fields.vat_reg_no}', ictad_reg_no='${fields.ictad_reg_no}',
                      bank='${fields.bank}', branch='${fields.branch}', business_nature='${fields.business_nature}', business_type='${fields.business_type}', credit_offered='${fields.credit_offered}',
                      maximum_credit='${fields.maximum_credit}', credit_period='${fields.credit_period}', experience='${fields.experience}' WHERE supplier_id='${fields.email}'`;
    }
      db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Save supplier registration
const saveSupplierRegistration = (fields, files) => new Promise(async (resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const date = new Date(fields.date).getFullYear();
    const bufferPayment = Buffer.from(files.payment.path)
    const sqlQueryString = `INSERT INTO registration VALUES ('${date}-${fields.email}', '${fields.date}', '${fields.email}', 
                            'no', '${fields.payment_bank}', '${fields.shroff}', '${fields.amount}', '${bufferPayment}', '${fields.payment_type}')`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Fetch manufacturer's auth doc
const getAuthFile = () => new Promise(async (resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `SELECT document FROM manufacture_auth`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Save price schedule data
const enterSupplierBid = (data) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      const sqlQueryString = `INSERT INTO bid VALUES ('bid0001', 'this is for bid0001', 'locked', 'pending', '${data.supplier_id}', '${data.procurement_id}', '${data.subtotal}', '${data.total_with_vat}', '${data.vat_no}', '${data.authorized}')`;
      db.query(sqlQueryString, (error, results, fields) => {
        connection.release();
        resolve(results);
      });
    });
  });

// Save bid products of a single bid
const saveBidProducts = (items) =>
  new Promise((resolve, reject) => {
    console.log(items);
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      for (const index in items) {
        const sqlQueryString = `INSERT INTO bid_product VALUES ('bid0001', '${items[index].prod_id}', '${items[index].figures}', '${items[index].qty}', '${items[index].vat}', '${items[index].make}', '${items[index].date}', '${items[index].validity}', '${items[index].credit}')`;
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
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results[0]);
    });
  });
});

module.exports = {
  checkExistingSupplier,
  getSupplierInfo,
  registerSupplier,
  saveSupplierInfo,
  saveSupplierRegistration,
  getAuthFile,
  enterSupplierBid,
  saveBidProducts,
  getSupplierData,
  getNewRequests,
  getOngoingProcurements,
  getCompletedProcurements,
  getPendingOrders,
  getCompletedOrders,
  getSupplierByUserId,
};
