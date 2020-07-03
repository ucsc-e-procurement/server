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

const create_request = (data) =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      let query_format =
        "INSERT INTO HOD_REQUEST(procurement_name, reorder, description, division, procurement_type, head_of_division_id) VALUES (?,?,?,?,?,?)";
      let query = db.format(query_format, [
        procurement_name,
        reorder,
        description,
        division,
        procurement_type,
        head_of_division_id,
      ]);
      //'${procurement_name}', '${reorder}', '${description}', '${division}', '${procurement_type}', '${head_of_division_id}'
      db.query(query, (errQuery, results) => {
        if (errQuery) reject(errQuery);
        connection.release();
        resolve(results.insertId);
      });
    });
  });

const test_create_request = (data) =>
  new Promise((resolve, reject) => {
    console.log(data.division);
    console.log(data.description);
    console.log(data.procurement_name);
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      let query =
        "INSERT INTO HOD_REQUEST(procurement_name, reorder, description, division, procurement_type, head_of_division_id) VALUES ('Canon DM-345X toner', true, 'Canon DM-345X toner', 'ENG', 'G', 'emp00004')";
      db.query(query, (errQuery, results) => {
        if (errQuery) reject(errQuery);
        connection.release();
        resolve(results.insertId);
      });
    });
  });

module.exports = {
  get_init_all,
  get_init,
  get_approved,
  get_completed,
  get_terminated,
  create_request,
  test_create_request,
};
