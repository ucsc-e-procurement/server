const { resolve } = require("path");

const db = require("./mysql").pool;

const get_init_all = () =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(`SELECT * FROM HOD_REQUEST`, (errQuery, results) => {
        connection.release();
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });

const get_init = (hod_id) =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(
        `SELECT * FROM PRODUCT_REQUISITION WHERE head_of_division_id = '${hod_id}' AND status = 'I'`,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

const get_approved = (hod_id) =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(
        `SELECT * FROM PRODUCT_REQUISITION WHERE head_of_division_id = '${hod_id}' AND status = 'A'`,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

const get_completed = (hod_id) =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(
        `SELECT * FROM PRODUCT_REQUISITION WHERE head_of_division_id = '${hod_id}' AND status = 'C'`,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

const get_terminated = (hod_id) =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(
        `SELECT * FROM PRODUCT_REQUISITION WHERE head_of_division_id = '${hod_id}' AND status = 'T'`,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

module.exports = {
  get_init_all,
  get_init,
  get_approved,
  get_completed,
  get_terminated,
};
