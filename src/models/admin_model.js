const db = require("./mysql").pool;


  

const getSuppliers = () =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = "SELECT * FROM supplier";
      db.query(sqlQueryString, (error, result, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });


const getSupplierById = (id) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM supplier WHERE supplier_id='${id}'`;
      db.query(sqlQueryString, (error, result, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(result[0]);
      });
    });
  });





module.exports = {
  getSuppliers,
  getSupplierById,
  
};
