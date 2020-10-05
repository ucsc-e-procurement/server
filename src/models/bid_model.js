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

// const sqlQueryString = `SELECT * FROM bid INNER JOIN bid_product ON bid.bid_id=bid_product.bid_id WHERE supplier_id='${id}'`;

module.exports = {

  createBid,
  getBidsBySupplierId,
  getBidProductsById,
  getBidById
};
