const db = require("./mysql").pool;


const getCompletedProcurements = (employee_id) => new Promise((resolve, reject) => {
  db.getConnection((err, connection) => {
    if (err) {
      reject(err);
      return;
    }

    //SQL Query
    // const sqlQueryString = `SELECT procurement.*,
    //     CONCAT('[',GROUP_CONCAT(CONCAT('{"prod_id":"',product.product_id,'","product_name":"',product.product_name,'","prod_desc":"',product.description,'", "bid":"',bid.quotation,'"}')),']') AS products 
    //     FROM procurement 
    //     INNER JOIN bid 
    //     ON bid.procurement_id = procurement.procurement_id
    //     INNER JOIN bid_product
    //     ON bid.bid_id = bid_product.bid_id
    //     INNER JOIN product 
    //     ON product.product_id = bid_product.product_id
    //     WHERE procurement.procurement_id = 'UCSC/NSP1/G/ENG/2020/0003'`;
    const sqlQueryString = `SELECT DISTINCT
        procurement.*, procurement.status AS procurement_status, product_requisition.*, product_requisition.status AS requisition_status, bid.*, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"bid_id":"', bid.bid_id,'", "supplier_id":"', supplier.supplier_id,'", "supplier_name":"', supplier.name,'","product_id":"',product.product_id,'","product_name":"',product.product_name,'","qty":"',bid_product.quantity,'","price":"',bid_product.price, ' ", "amount":"', bid.quotation,'"}')), ']') AS bids
        FROM procurement 
        INNER JOIN product_requisition ON procurement.requisition_id = product_requisition.requisition_id
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
      const sqlQueryString = `SELECT DISTINCT
        procurement.*, procurement.status AS procurement_status, product_requisition.*, product_requisition.status AS requisition_status, bid.*, bid.status AS bid_status,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"bid_id":"', bid.bid_id,'", "supplier_id":"', supplier.supplier_id,'", "supplier_name":"', supplier.name,'","product_id":"',product.product_id,'","product_name":"',product.product_name,'","qty":"',bid_product.quantity,'","price":"',bid_product.price, ' ", "amount":"', bid.quotation,'"}')), ']') AS bids
        FROM procurement 
        INNER JOIN product_requisition ON procurement.requisition_id = product_requisition.requisition_id
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

module.exports = {
    // getSupplierData,
    // getNewRequests,
    getOngoingProcurements,
    getCompletedProcurements
};
  