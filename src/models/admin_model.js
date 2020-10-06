const db = require("./mysql").pool;

// Database Model Health Check - Development Purposes Only
const testUserModel = () => new Promise((resolve, reject) => {
  db.connect((err) => {
    if (err) reject(err);
    db.query();
  });
});

// Get Direct ongoing procurement List
const getDirectOngoingProcurements = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT procurement.procurement_id, procurement.category 
                            FROM procurement
                            INNER JOIN requisition ON procurement.requisition_id = requisition.requisition_id
                            WHERE procurement.step = 3 AND requisition.director_recommendation = 'Approved' AND procurement.procurement_method = 'direct'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Get list of suppliers
const getSupplierList = (category) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT *
                            FROM supplier
                            WHERE status = 'active' AND category LIKE '%${category}%'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Send RFQ in direct ongoing procurements
const sendRFQDirectOngoingProcurements = (supplierId,procurementId,date,deadline) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString1 = `INSERT INTO rfq(status,deadline,procurement_id,supplier_id,date) VALUES('sent', '${deadline}' , '${procurementId}', '${supplierId}', '${date}');`;
    const sqlQueryString2 = `UPDATE procurement SET step = 4 WHERE procurement.procurement_id = '${procurementId}'`;

    db.query(sqlQueryString1, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      console.log(sqlQueryString1, results, fields);

      if (error) {
        connection.release();
        console.log(JSON.stringify(error));
      } else {
        db.query(sqlQueryString2, (error, results, fields) => {
          connection.release();
          console.log(sqlQueryString1, results, fields);
          resolve(JSON.parse(JSON.stringify(results)));
        });
      }
    });
  });
});

// Get Shopping ongoing procurement List
const getShoppingOngoingProcurements = () => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT procurement.procurement_id, procurement.category 
                            FROM procurement
                            INNER JOIN requisition ON procurement.requisition_id = requisition.requisition_id
                            WHERE procurement.step = 3 AND requisition.director_recommendation = 'Approved' AND procurement.procurement_method = 'shopping'`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      console.log(sqlQueryString, results, fields);
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

// Send RFQ in shopping ongoing procurements
const sendRFQShoppingOngoingProcurements = (date,deadline,procurementId,category) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }
    // SQL Query
    const sqlQueryString = `SELECT *
                            FROM supplier
                            WHERE status = 'active' AND category LIKE '%${category}%'`;
    db.query(sqlQueryString, (error, results, fields) => {
      for(var i = 0; i < results.length; i++){
        const sqlQueryString2 = `INSERT INTO rfq(status,deadline,procurement_id,supplier_id,date) VALUES('sent', '${deadline}' , '${procurementId}', '${results[i].supplier_id}', '${date}');`;
        const sqlQueryString3 = `UPDATE procurement SET step = 4 WHERE procurement.procurement_id = '${procurementId}'`;

        db.query(sqlQueryString2, (error, results, fields) => {
          // Release SQL Connection Back to the Connection Pool
          console.log(sqlQueryString2, results, fields);   
          if (error) {
            console.log(JSON.stringify(error));
          } else {
            db.query(sqlQueryString3, (error, results, fields) => {
              console.log(sqlQueryString2, results, fields);
            });
          }
        });
      }
      connection.release(); 
      resolve(JSON.parse(JSON.stringify(results)));     
    });
  });
});

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

const updateSupplierRegistrationStatus = (registrationNo, status) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `UPDATE registration SET verified='${status}' WHERE registration_no='${registrationNo}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, result, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);

        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
  });


const getSupplierRegistrationStatus = (supplierId, year) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM registration WHERE supplier_id='${supplierId}' AND registration_date LIKE '${year}%'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, results, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        let status = "";
        if(results.length > 0){
          if(results[0].verified === "verified"){
            status = "VERIFIED";
          } else if(results[0].verified === "denied") {
            status = "DENIED";

          }
          else {
            status = "REGISTERED_BUT_NOT_VERIFIED";
          }
        } else {
          status = "NOT_REGISTERED";
        }
        resolve({status: status});
        
      });
    });
  });

const getSupplierRegistrationsBySupplierID = (supplierId) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM registration WHERE supplier_id='${supplierId}'`;
      console.log(sqlQueryString);
      db.query(sqlQueryString, (error, results, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);

        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });





module.exports = {
  getSuppliers,
  getSupplierById,
  getRegistrationsByYear,
  getRegistrationById,
  updateSupplierRegistrationStatus,
  getDirectOngoingProcurements,
  getShoppingOngoingProcurements,
  getSupplierList,
  sendRFQDirectOngoingProcurements,
  sendRFQShoppingOngoingProcurements,
  getSupplierRegistrationStatus,
  getSupplierRegistrationsBySupplierID
  
};
