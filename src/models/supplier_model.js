const bcrypt = require("bcrypt");
const { resolve } = require("path");

const db = require("./mysql").pool;

// Check if supllier exists before registering
const checkExistingSupplier = (username) => new Promise((resolve,reject) => {
    db.getConnection((err, connection) => {
        if(err) {
            reject(err);
            return;
        }
        const sqlQueryString = `SELECT * FROM user WHERE username='${username}'`;
        db.query(sqlQueryString, (error, results, fields) => {
            // Release SQL Connection Back to the Connection Pool
            connection.release();
            resolve(JSON.parse(JSON.stringify(results)));
        });
    })
})

// Get last user_id from database
const getLastID = () => new Promise ((resolve, reject) => {
    db.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
        const sqlQueryString = `SELECT MAX(user_id) AS lastID FROM user`;
        db.query(sqlQueryString, (error, results, fields) => {
            // Release SQL Connection Back to the Connection Pool
            connection.release();
            resolve(results);
        });
    });
})

// Save user
const registerSupplier = (data, userId) => new Promise(async (resolve, reject) => {
    const hash = await bcrypt.hash(data['password'], 10);
    db.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
        const sqlQueryString = `INSERT INTO user VALUES ('${userId}', '${data['email']}', '${hash}', 'supplier')`
        db.query(sqlQueryString, (error, results, fields) => {
            connection.release();
            resolve(results);
        });
        
    });
})

// Save supplier information
const saveSupplierInfo = (data, userId, supplierId) => new Promise(async (resolve, reject) => {    
    db.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
        const sqlQueryString = `INSERT INTO supplier VALUES ('${supplierId}', '${data.body['name']}', '${data.body['address']}', '${data.body['contact']}', '${data.body['categories']}', '${data.body['email']}', 'processing', '${userId}', '${data.files['image']}')`
        db.query(sqlQueryString, (error, results, fields) => {
            connection.release();
            resolve(results);
        });
        
    });
})

// Save price schedule data
const enterSupplierBid = (username, password, status = true) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
  
        // SQL Query
        const sqlQueryString = `SELECT * FROM user WHERE username='${username}' AND password='${password}'`;
        db.query(sqlQueryString, (error, results, fields) => {
            // Release SQL Connection Back to the Connection Pool
            connection.release();
            resolve(results);
        });
    });
});

module.exports = {
    checkExistingSupplier,
    getLastID,
    registerSupplier,
    saveSupplierInfo,
    enterSupplierBid,
};