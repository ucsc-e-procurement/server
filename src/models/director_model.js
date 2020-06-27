const db = require("./mysql").connection;

// const director = () => new Promise((resolve, reject) => {
//   db.connect((errDB) => {
//     if (errDB) reject(errDB);
//     db.query("SELECT * FROM test", (errQuery, result) => {
//       if (errQuery) reject(errQuery);
//       resolve(result);
//     });
//     db.end();
//   });
// });

module.exports = {

};
