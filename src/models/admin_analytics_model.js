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
        if(error) reject(error);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let index = 0;
        let newResults = months.map(month => {
          index++;
          return {
            month: month,
            index: index,
            count: 0
          };
        });

        results.map(result => {
          newResults[parseInt(result.month) - 1].count = result.count;
          return;
        });

        resolve(newResults);
      });
    });
  });








module.exports = {
  getMonthlyProductRequisitionCount
  
};
