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

const getRegistrationsByYear = (year) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      const dateRange = {
        begin: `${year}-01-01`,
        end: `${year}-12-31`,

      };

      // SQL Query
      const sqlQueryString = `SELECT * FROM registration LEFT JOIN supplier ON registration.supplier_id=supplier.supplier_id WHERE registration_date BETWEEN '${dateRange.begin}' AND '${dateRange.end}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, results, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);

        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });

const getRegistrationById = (registrationId) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM registration LEFT JOIN supplier ON registration.supplier_id=supplier.supplier_id WHERE registration_no='${registrationId}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, results, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);

        resolve(JSON.parse(JSON.stringify(results[0])));
      });
    });
  });





module.exports = {
  getSuppliers,
  getSupplierById,
  getRegistrationsByYear,
  getRegistrationById
  
};
