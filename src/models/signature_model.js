const db = require("./mysql").pool;

// Insert Record Into Signature
const addSignature = (userId, imageURL, base64Image, isVerified = 0, isDeleted = 0) => new Promise((resolve, reject) => {
  db.getConnection((errorConnection, connection) => {
    if (errorConnection) {
      reject(errorConnection);
      return;
    }

    // SQL Query
    const sqlQueryString = `INSERT INTO signature(user_id, base64_image, image_url, is_verified, is_deleted) VALUES('${userId}', '${base64Image}', '${imageURL}', ${isVerified}, ${isDeleted})`;

    db.query(sqlQueryString, (errorSQL, results, fields) => {
      if (errorSQL) reject(errorSQL);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results);
    });
  });
});

// Update Verification Status
const updateVerificationStatus = (userId, newStatus) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = `UPDATE signature SET is_verified=${newStatus} WHERE user_id='${userId}'`;

    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results);
    });
  });
});

// Find SIgnature Entry By UserID
const getSignatureByUserId = (userId, isVerified = 0, isDeleted = 0) => new Promise((resolve, reject) => {
  db.getConnection((errorConnection, connection) => {
    if (errorConnection) {
      reject(errorConnection);
      return;
    }

    // SQL Query
    const sqlQueryString = `SELECT * FROM signature WHERE user_id='${userId}' AND is_verified=${isVerified} AND is_deleted=${isDeleted}`;

    db.query(sqlQueryString, (errorSQL, results, fields) => {
      if (errorSQL) reject(errorSQL);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log("ZZZZZZZZZZZZZZZ: ", results, errorSQL);
      resolve(results[0]);
    });
  });
});

// Find Signature Entry By UserID
const addOTP = (userId, hashedOTP, isValid = 0) => new Promise((resolve, reject) => {
  db.getConnection((errorConnection, connection) => {
    if (errorConnection) {
      reject(errorConnection);
      return;
    }

    // SQL Query
    const sqlQueryString = `INSERT INTO signature_otp(user_id, otp, is_valid) VALUES('${userId}', '${hashedOTP}', is_valid=${isValid})`;

    db.query(sqlQueryString, (errorSQL, results) => {
      if (errorSQL) reject(errorSQL);
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log("ZZZZZZZZZZZZZZZ: ", results, errorSQL);
      resolve(results);
    });
  });
});

module.exports = {
  addSignature,
  updateVerificationStatus,
  getSignatureByUserId,
  addOTP,
};
