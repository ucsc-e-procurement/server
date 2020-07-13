const db = require("./mysql").pool;

// Get Employee Details By UserID
const getProducts = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    // SQL Query
    const sqlQueryString = "SELECT * FROM product";
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      resolve(results);
    });
  });
});

module.exports = {

  getProducts,

};
