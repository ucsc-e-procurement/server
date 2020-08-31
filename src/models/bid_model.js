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

module.exports = {

  createBid,
};
