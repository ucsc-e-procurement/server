const db = require("./mysql").pool;

const createBid = (bidData) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      // SQL Query
      const sqlQueryString = `INSERT INTO bid VALUES('${bidData.bid_id}', '${bidData.description}', '${bidData.lock}', '${bidData.status}', '${bidData.supplier_id}', '${bidData.procurement_id}', ${bidData.total}, ${bidData.total_with_vat}, '${bidData.vat_no}', '${bidData.authorize_person}')`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (errQuery, result) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (errQuery) reject(errQuery);
        resolve({...result});
      });
    });
  });


const getBidsBySupplierId = (id) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM bid WHERE supplier_id='${id}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, result, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });

const getBidProductsById = (id) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM bid_product INNER JOIN product ON bid_product.product_id=product.product_id WHERE bid_id='${id}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, results, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        console.log();
        resolve(results);
      });
    });
  });

const getBidById = (id) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM bid WHERE bid_id='${id}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, results, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        console.log();
        resolve(results[0]);
      });
    });
  });

// Get Bid Opening Dates
const getBidOpeningSchedule = (status) =>
  new Promise((resolve, reject) => {
    console.log("I'm Here");
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT bid_opening_date, procurement_id, status FROM procurement WHERE status='${status}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, results, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);

        resolve(results);
      });
    });
  });


const updateBidValues = (bidData) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      // SQL Query
      const sqlQueryString = `UPDATE bid SET total=${bidData.total}, total_with_vat=${bidData.total_with_vat}, lock="unlocked" WHERE bid_id='${bidData.bid_id}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (errQuery, result) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (errQuery) reject(errQuery);
        resolve({...result});
      });
    });
  });

const createBidProduct = (bidId, product) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      // SQL Query
      //  credit_period quotation_validity delivery_date make vat quantity unit_price product_id bid_id 
      const sqlQueryString = `INSERT INTO bid_product VALUES('${bidId}', '${product.product_id}', ${product.unit_price}, ${product.quantity}, '${product.vat}', '${product.make}', '${product.delivery_date}', ${product.quotation_validity}, ${product.credit_period} )`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (errQuery) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (errQuery) reject(errQuery);
        resolve({message: "Product Added"});
      });
    });
  });



// const sqlQueryString = `SELECT * FROM bid INNER JOIN bid_product ON bid.bid_id=bid_product.bid_id WHERE supplier_id='${id}'`;

module.exports = {

  createBid,
  getBidsBySupplierId,
  getBidProductsById,
  getBidById,
  getBidOpeningSchedule,
  createBidProduct,
  updateBidValues
};
