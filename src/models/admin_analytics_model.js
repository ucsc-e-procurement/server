const db = require("./mysql").pool;

// ######################################################################################################################################################
//                                                  Monthly Product Requisition Count of a Given Year
// ######################################################################################################################################################
const getMonthlyProductRequisitionCount = (year) =>
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
      const sqlQueryString = `SELECT MONTH(date) AS month , COUNT(*) AS count FROM requisition WHERE date BETWEEN '${dateRange.begin}'  AND '${dateRange.end}' GROUP BY MONTH(date)`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (error) reject(error);

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        let index = 0;
        let newResults = months.map((month) => {
          index++;
          return {
            month: month,
            index: index,
            count: 0,
          };
        });

        results.map((result) => {
          newResults[parseInt(result.month) - 1].count = result.count;
          return;
        });

        resolve(newResults);
      });
    });
  });
// ######################################################################################################################################################
//                                                  Get Annual Method-wise Procurements
// ######################################################################################################################################################
const getAnnualMethodWiseProcurementCount = (year) =>
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
      const sqlQueryString = `SELECT procurement_method as method, count(*) as count FROM procurement WHERE bid_opening_date BETWEEN '${dateRange.begin}'  AND '${dateRange.end}' GROUP BY procurement_method`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (error) reject(error);

        const procurementData = [
          { method: "Direct Method", code: "DIM", count: 0 },
          { method: "National Competitive Bidding", code: "NCB", count: 0 },
          { method: "Normal Price Schedule", code: "NSP1", count: 0 },
          { method: "National Shopping", code: "NSP2", count: 0 },
        ];

        results.map((data) => {
          if (data.method === "DIM") {
            procurementData[0].count = data.count;
          } else if (data.method === "NCB") {
            procurementData[1].count = data.count;
          } else if (data.method === "NSP1") {
            procurementData[2].count = data.count;
          } else if (data.method === "NSP2") {
            procurementData[3].count = data.count;
          }

          return;
        });


        resolve(procurementData);
      });
    });
  });
// ######################################################################################################################################################
//               Get Main Cards Data (Ongoing Procurement Count/Registered Suppliers/Completed Procurements/Requisition Count)
// ######################################################################################################################################################
const getOngoingProcurementsCount = (year) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement INNER JOIN requisition ON procurement.requisition_id=requisition.requisition_id WHERE procurement.status='on-going' AND requisition.date LIKE '*${year}*'`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (error) reject(error);
        resolve({count: results.length});
      });
    
    });
  });
const getRegisteredSuppliersCount = (year) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement INNER JOIN requisition ON procurement.requisition_id=requisition.requisition_id WHERE procurement.status='on-going' AND requisition.date LIKE '*${year}*'`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (error) reject(error);
        resolve({count: results.length});
      });
    
    });
  });
const getCOmpletedProcurementsCount = (year) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      // SQL Query
      const sqlQueryString = `SELECT * FROM procurement INNER JOIN requisition ON procurement.requisition_id=requisition.requisition_id WHERE procurement.status='on-going' AND requisition.date LIKE '*${year}*'`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        if (error) reject(error);
        resolve({count: results.length});
      });
    
    });
  });
const getRequisitionCount = (year) =>
  new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }
    
    });
  });

module.exports = {
  getMonthlyProductRequisitionCount,
  getAnnualMethodWiseProcurementCount,
  getOngoingProcurementsCount,
  getRegisteredSuppliersCount,
  getCOmpletedProcurementsCount,
  getRequisitionCount
};
