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
        `SELECT * FROM REQUISITION WHERE head_of_division_id = '${hod_id}' AND (status = 'I' OR status = 'D')`,
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
        `SELECT * FROM REQUISITION WHERE head_of_division_id = '${hod_id}' AND status = 'A'`,
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
        `SELECT * FROM REQUISITION WHERE head_of_division_id = '${hod_id}' AND status = 'C'`,
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
        `SELECT * FROM REQUISITION WHERE head_of_division_id = '${hod_id}' AND status = 'T'`,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

//create new rquisition
const create_request = (data) =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        console.log(errDB);
        return;
      }
      //description, status, head_of_division_id, director_id, deputy_bursar_id, division, reorder
      let query =
        "INSERT INTO REQUISITION(description, procurement_type, head_of_division_id, director_id, deputy_bursar_id, division, reorder) VALUES('" +
        data.description +
        "', '" +
        data.procurement_type +
        "', '" +
        data.head_of_division_id +
        "', '" +
        data.director_id +
        "', '" +
        data.deputy_bursar_id +
        "', '" +
        data.division +
        "', " +
        data.reorder +
        ")";
      db.query(query, (errQuery, results) => {
        if (errQuery) reject(errQuery);
        connection.release();
        resolve(results);
      });
    });
  });

const get_dir_empid = () =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(
        `select employee.employee_id
        from employee
        inner join user
        on user.user_id = employee.user_id
        where user.user_role = 'DIR' and user.status = false; `,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

const get_db_empid = () =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(
        `select employee.employee_id
        from employee
        inner join user
        on user.user_id = employee.user_id
        where user.user_role = 'DB' and user.status = false;`,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

const get_products = () =>
  new Promise((resolve, reject) => {
    db.getConnection((errDB, connection) => {
      if (errDB) {
        reject(errDB);
        return;
      }
      db.query(
        `SELECT product_name
        FROM product;`,
        (errQuery, results) => {
          if (errQuery) reject(errQuery);
          connection.release();
          resolve(JSON.parse(JSON.stringify(results)));
        }
      );
    });
  });

// const test_create_request = (data) =>
//   new Promise((resolve, reject) => {
//     console.log(data.procurement_name);
//     console.log(data.head_of_division_id);
//     console.log(data.description);
//     db.getConnection((errDB, connection) => {
//       if (errDB) {
//         reject(errDB);
//         return;
//       }
//       let query =
//         "INSERT INTO HOD_REQUEST(procurement_name, reorder, description, division, procurement_type, head_of_division_id) VALUES ('Hitachi K-3000 toner', true, 'Hitachi K-3000 toner', 'NOC', 'G', 'emp00005')";
//       db.query(query, (errQuery, results) => {
//         if (errQuery) reject(errQuery);
//         connection.release();
//         resolve(results.insertId);
//       });
//     });
//   });

module.exports = {
  get_init_all,
  get_init,
  get_approved,
  get_completed,
  get_terminated,
  get_dir_empid,
  get_db_empid,
  get_products,
  create_request,
};
