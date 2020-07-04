const db = require("./mysql").pool;


const getCompletedProcurements = (employee_id) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    //SQL Query
    // const sqlQueryString = `SELECT procurement.*,
    //     CONCAT('[',GROUP_CONCAT(CONCAT('{"prod_id":"',product.product_id,'","product_name":"',product.product_name,'","prod_desc":"',product.description,'", "bid":"',bid.total_with_vat,'"}')),']') AS products 
    //     FROM procurement 
    //     INNER JOIN bid 
    //     ON bid.procurement_id = procurement.procurement_id
    //     INNER JOIN bid_product
    //     ON bid.bid_id = bid_product.bid_id
    //     INNER JOIN product 
    //     ON product.product_id = bid_product.product_id
    //     WHERE procurement.procurement_id = 'UCSC/NSP1/G/ENG/2020/0003'`;
    const sqlQueryString = `SELECT DISTINCT
        procurement.*, procurement.status AS procurement_status, requisition.*, requisition.status AS requisition_status, bid.*, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"bid_id":"', bid.bid_id,'", "supplier_id":"', supplier.supplier_id,'", "supplier_name":"', supplier.name,'","product_id":"',product.product_id,'","product_name":"',product.product_name,'","qty":"',bid_product.quantity,'","unit_price":"',bid_product.unit_price, ' ", "total_with_vat":"', bid.total_with_vat,'"}')), ']') AS bids
        FROM procurement 
        INNER JOIN requisition ON procurement.requisition_id = requisition.requisition_id
        INNER JOIN bid ON procurement.procurement_id = bid.procurement_id
        INNER JOIN bid_product ON bid.bid_id = bid_product.bid_id
        INNER JOIN product ON product.product_id = bid_product.product_id
        INNER JOIN supplier ON bid.supplier_id = supplier.supplier_id
        WHERE procurement.tec_team_id IN (SELECT tec_team_id FROM tec_emp WHERE employee_id='${employee_id}') AND procurement.status='completed'
        GROUP BY bid.procurement_id`;
    db.query(sqlQueryString, (error, results, fields) => {
      // Release SQL Connection Back to the Connection Pool
      connection.release();
      //console.log(results)
      resolve(JSON.parse(JSON.stringify(results)));
    });
  });
});

const getOngoingProcurements = (employee_id) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      // do not select bid.procurement_id in this query as it returns proc_id = null for procs with no bids
      const sqlQueryString = `SELECT DISTINCT
        procurement.*, procurement.status AS procurement_status, requisition.*, requisition.status AS requisition_status, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"bid_id":"', bid.bid_id,'", "supplier_id":"', supplier.supplier_id,'", "supplier_name":"', supplier.name, '", "supplier_address":"', supplier.address,'","product_id":"',product.product_id,'","product_name":"',product.product_name,'","qty":"',bid_product.quantity,'","unit_price":"',bid_product.unit_price, ' ", "total_with_vat":"', bid.total_with_vat,'"}')), ']') AS bids
        FROM procurement 
        INNER JOIN requisition ON procurement.requisition_id = requisition.requisition_id
        LEFT JOIN bid ON procurement.procurement_id = bid.procurement_id
        LEFT JOIN bid_product ON bid.bid_id = bid_product.bid_id
        LEFT JOIN product ON product.product_id = bid_product.product_id
        LEFT JOIN supplier ON bid.supplier_id = supplier.supplier_id
        WHERE procurement.tec_team_id IN (SELECT tec_team_id FROM tec_emp WHERE employee_id='${employee_id}') AND procurement.status='on-going'
        GROUP BY bid.procurement_id`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        //console.log(results)
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });

  const getRequisition = (requisition_id) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT DISTINCT
        requisition.*,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"product_id":"', product.product_id,'", "product_name":"', product.product_name,'","qty":"',requisition_product.quantity,'"}')), ']') AS products
        FROM requisition
        INNER JOIN requisition_product ON requisition.requisition_id = requisition_product.requisition_id 
        INNER JOIN product ON requisition_product.product_id = product.product_id
        WHERE requisition.requisition_id = '${requisition_id}'
        GROUP BY requisition.requisition_id`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        //console.log(results)
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });

  const getTecTeam = (tec_team_id) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      // SQL Query
      const sqlQueryString = `SELECT DISTINCT
        CONCAT('[',GROUP_CONCAT(CONCAT('{"employee_id":"', employee.employee_id,'", "employee_name":"', employee.name,'","capacity":"', tec_emp.capacity,'"}')), ']') AS team
        FROM tec_emp
        INNER JOIN employee ON tec_emp.employee_id = employee.employee_id 
        WHERE tec_emp.tec_team_id = '${tec_team_id}'
        GROUP BY tec_emp.tec_team_id`;
      db.query(sqlQueryString, (error, results, fields) => {
        // Release SQL Connection Back to the Connection Pool
        connection.release();
        //console.log(results)
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  });

module.exports = {
    // getSupplierData,
    // getNewRequests,
    getOngoingProcurements,
    getCompletedProcurements,
    getRequisition,
    getTecTeam
};
  