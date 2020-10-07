const db = require("./mysql").pool;
const bcrypt = require("bcrypt");
const { resolve } = require("path");
const firebase = require("firebase");

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
    const sqlQueryString = `SELECT rfq.*, procurement.procurement_id, procurement.category, procurement.procurement_method, CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', requisition_product.product_id,'", "product_name":"', product.product_name, ' ", "qty":"', requisition_product.quantity,'"}')), ']') AS products 
        FROM rfq 
        INNER JOIN procurement ON rfq.procurement_id = procurement.procurement_id 
        INNER JOIN requisition_product ON procurement.requisition_id = requisition_product.requisition_id 
        INNER JOIN product ON requisition_product.product_id = product.product_id 
        WHERE rfq.supplier_id='${supplier_id}' AND rfq.status='sent' AND procurement.step < 7
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
        rfq.*, procurement.procurement_id, procurement.category, procurement.status AS procurement_status, procurement.bid_opening_date, bid.total_with_vat, bid.status AS bid_status, procurement.step,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', bid_product.product_id,'", "product_name":"', product.product_name, ' ", "qty":"', bid_product.quantity, '", "unit_price":"', bid_product.unit_price,'"}')), ']') AS bids
        FROM rfq 
        INNER JOIN procurement ON rfq.procurement_id = procurement.procurement_id 
        INNER JOIN bid ON procurement.procurement_id = bid.procurement_id
        INNER JOIN bid_product ON bid.bid_id = bid_product.bid_id
        INNER JOIN product ON bid_product.product_id = product.product_id
        WHERE rfq.supplier_id='${supplier_id}' AND procurement.status='on-going' AND bid.supplier_id='${supplier_id}' AND procurement.step>= 7
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
        WHERE rfq.supplier_id='${supplier_id}' AND procurement.status='completed' AND bid.supplier_id='${supplier_id}'
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
    if(fields.user_state == 'new') {
      sqlQueryString = `INSERT INTO supplier VALUES ('${fields.email}', '${fields.contact_name}', '${fields.business_address}', 
                      '${fields.contact}', '${fields.cat_selection}', '${fields.official_email}', '${fields.legal}', '${fields.fax}', 
                      '${fields.web}', '${fields.business_reg_no}', '${fields.vat_reg_no}', '${fields.ictad_reg_no}',
                      '${fields.bank}', '${fields.branch}', '${fields.business_nature}', '${fields.business_type}', '${fields.credit_offered}',
                      '${fields.maximum_credit}', '${fields.credit_period}', '${fields.experience}', '${fields.email}', 'inactive')`;
    }
    else if (fields.user_state == 'renew') {
      sqlQueryString = `UPDATE supplier SET name=${fields.contact_name}', address='${fields.business_address}', 
                      contact_number='${fields.contact}', category='${fields.cat_selection}', email='${fields.official_email}', legal='${fields.legal}', fax='${fields.fax}', 
                      web='${fields.web}', business_reg'${fields.business_reg_no}', vat_reg_no='${fields.vat_reg_no}', ictad_reg_no='${fields.ictad_reg_no}',
                      bank='${fields.bank}', branch='${fields.branch}', business_nature='${fields.business_nature}', business_type='${fields.business_type}', credit_offered='${fields.credit_offered}',
                      maximum_credit='${fields.maximum_credit}', credit_period='${fields.credit_period}', experience='${fields.experience}', status='inactive' WHERE supplier_id='${fields.email}'`;
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
    const sqlQueryString = `INSERT INTO registration VALUES ('${date}-${fields.email}', '${fields.date}', '${fields.email}', 
                            'no', '${fields.payment_bank}', '${fields.shroff}', '${fields.amount}', '${fields.payment_type}')`;
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

// Fetch bid guarantee pdf file
const getBidFile = () => new Promise(async (resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `SELECT document FROM bid_guarantee`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get next increment value of bid table
const nextIncrement = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'bid'`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// price schedule encryption
const addBidToFirebase = (data) => new Promise((resolve, reject) => {
  const responseKey = data.supplier_id.replace(".", "")
  let itemRef = firebase.firestore().collection("ScheduleOfRequirements").doc(data.doc_id).collection("Items");
  let iterator = 0;
  itemRef.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
          [responseKey]: data.items[iterator].bidderResponse
        })
        iterator++;
      });
    })
    .catch(err => {
      reject(err);
    });
  let bidRef = firebase.firestore().collection("bids").doc(data.bod);
  bidRef.set({
    [data.key]: data.encrypted    
  }).then(() => {
    resolve('done');
  }).catch(err => {
    reject(err);
  })
});

// Save price schedule data
const enterSupplierBid = (fields) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const sqlQueryString = `INSERT INTO bid (description, lock, status, supplier_id, procurement_id, vat_no, authorize_person, designation, nic) VALUES ('this is for bid0001', 'locked', 'pending', '${fields.supplier_id}', '${fields.procurement_id}', '${fields.vat_no}', '${fields.authorized}', '${fields.designation}', '${fields.nic}')`;
      db.query(sqlQueryString, (error, results, fields) => {
        connection.release();
        resolve(results);
        console.log(results, error);
      });
    });
  });

// Save price schedule data for direct method
const enterSupplierQuotation = (req) =>
new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    const sqlQueryString = "INSERT INTO bid (`description`, `lock`, `status`, `supplier_id`, `procurement_id`, `total`, `total_with_vat`, `vat_no`, `authorize_person`, `designation`, `nic`) VALUES ('this is for bid0001', 'locked', 'pending',"+`'${req.supplier_id}'`+","+`'${req.procurement_id}'`+","+`'${req.subtotal}'`+","+`'${req.total_with_vat}'`+","+`'${req.vat_no}'`+","+`'${req.authorized}'`+","+`'${req.designation}'`+","+`'${req.nic}'`+")";
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Save bid products of a single bid
const saveBidProducts = (items, id) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      for (const index in items) {
        const sqlQueryString = `INSERT INTO bid_product VALUES ('${id}', '${items[index].prod_id}', '${items[index].figures}', '${items[index].qty}', '${items[index].vat}', '${items[index].make}', '${items[index].date}', '${items[index].validity}', '${items[index].credit}')`;
        db.query(sqlQueryString);
      }
      connection.release();
      resolve();
    });
  });

// Udpdate procurement step after bid submission
const updateProcurementStep = (proc_id) =>
new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `UPDATE INTO procurement SET step=6 WHERE procurement_id='${proc_id}'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results[0]);
    });
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

// Accept bid submission
const acceptSubmission = (id) =>
new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `UPDATE rfq SET status = 'accepted' WHERE rfq_id = "${id}"`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
    });
  });
});

// Reject bid submission
const rejectSubmission = (id) =>
new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    const sqlQueryString = `UPDATE rfq SET status = 'rejected' WHERE rfq_id = "${id}"`;
    db.query(sqlQueryString, (error, results, fields) => {
      connection.release();
      resolve(results);
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
  getBidFile,
  nextIncrement,
  addBidToFirebase,
  enterSupplierBid,
  enterSupplierQuotation,
  saveBidProducts,
  updateProcurementStep,
  getSupplierData,
  getNewRequests,
  getOngoingProcurements,
  getCompletedProcurements,
  getPendingOrders,
  getCompletedOrders,
  getSupplierByUserId,
  acceptSubmission,
  rejectSubmission
};
