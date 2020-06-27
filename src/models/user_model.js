const db = require("./mysql").connection;

const testUserModel = () => new Promise((resolve, reject) => {
  db.connect((err) => {
    if (err) reject(err);
    db.query();
  });
});
