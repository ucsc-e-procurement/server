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
    console.log(items)
    db.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
        for (const index in items) {
            let sqlQueryString = `INSERT INTO bid_product VALUES ('bid0001', '${items[index].prod_id}', '${items[index].qty}', '${items[index].figures}', '${items[index].vat}', '${items[index].make}', '${items[index].date}', '${items[index].validity}', '${items[index].credit}')`;
            db.query(sqlQueryString);
        }
        connection.release();
        resolve();
    });
})

module.exports = {
    checkExistingSupplier,
    getLastID,
    registerSupplier,
    saveSupplierInfo,
    enterSupplierBid,
    saveBidProducts
};