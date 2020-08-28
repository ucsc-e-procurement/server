const db = require("./mysql").pool;

// Get Employee Details By UserID
const createProcurement = (procurementData) =>
  new Promise((resolve, reject) => {
    console.log(procurementData);
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `INSERT INTO procurement(procurement_id, procurement_method, bid_opening_date, expiration_date, requisition_id, bid_opening_team_id, tec_team_id, assistant_bursar_id, po_id, status, step, category, procurement_type, completed_date, finance_method) VALUES('${procurementData.procurement_id}', '${procurementData.procurement_method}', '${procurementData.bid_opening_date}', '${procurementData.expiration_date}', '${procurementData.requisition_id}', ${procurementData.bid_opening_team_id}, ${procurementData.tec_team_id},' ${procurementData.assistant_bursar_id}', '${procurementData.po_id}', '${procurementData.status}', ${procurementData.step}, '${procurementData.category}', '${procurementData.procurement_type}', '${procurementData.completed_date}', '${procurementData.finance_method}')`;
      db.query(sqlQueryString, (error, results, fields) => {
        
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(results);
      });
    });
  });

// Get Procurement By Requisition ID
const getProcurementByRequisitionId = (requisitionId) =>
  new Promise((resolve, reject) => {
    console.log(requisitionId);
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement WHERE requisition_id='${requisitionId}'`;
      db.query(sqlQueryString, (error, results, fields) => {
      
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(results);
      });
    });
  });

// Update Procurement Step
const updateProcurementStep = (updateProcurementStep, newStep) =>
  new Promise((resolve, reject) => {
    console.log(newStep);
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `UPDATE procurement SET step=${newStep} WHERE procurement_id=${updateProcurementStep}`;
      db.query(sqlQueryString, (error, result, fields) => {
    
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });

// Update Procurement Step
const getProcurementsByStatus = (status) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement WHERE status='${status}'`;
      db.query(sqlQueryString, (error, result, fields) => {
  
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });
  
// Update Procurement Step
const getProcurementsById = (id) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement WHERE procurement_id='${id}'`;
      db.query(sqlQueryString, (error, result, fields) => {

        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if(error) reject(error);
        resolve(result[0]);
      });
    });
  });

module.exports = {
  createProcurement,
  getProcurementByRequisitionId,
  updateProcurementStep,
  getProcurementsByStatus,
  getProcurementsById
};
