const db = require("./mysql").connection;

const test = () => new Promise((resolve, reject) => {
  db.connect((errDB) => {
    if (errDB) reject(errDB);
    db.query("SELECT * FROM test", (errQuery, result) => {
      if (errQuery) reject(errQuery);
      resolve(result);
    });
    db.end();
  });
});

const updateBid = (bidId, fieldValues) => new Promise((resolve, reject) => {
  db.connect((errDB) => {
    if (errDB) reject(errDB);

    const queryStr = `UPDATE bid SET total=${fieldValues.total} WHERE bid_id='${bidId}'`;
    db.query(queryStr, (errQuery, result) => {
      if (errQuery) reject(errQuery);
      resolve(result);
    });
    db.end();
  });
});

module.exports = {
  test,
  updateBid
};
