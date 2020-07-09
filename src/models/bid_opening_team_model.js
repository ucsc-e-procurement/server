const db = require("./mysql").pool;

const getCompletedProcurements = (employee_id) => new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
  
      //SQL Query

      const sqlQueryString = `SELECT DISTINCT
          procurement.*, procurement.status AS procurement_status, requisition.*, requisition.status AS requisition_status, bid.*, bid.status AS bid_status,
          CONCAT('[',GROUP_CONCAT(CONCAT('{"bid_id":"', bid.bid_id,'", "supplier_id":"', supplier.supplier_id,'", "supplier_name":"', supplier.name,'","product_id":"',product.product_id,'","product_name":"',product.product_name,'","qty":"',bid_product.quantity,'","unit_price":"',bid_product.unit_price, ' ", "total_with_vat":"', bid.total_with_vat,'"}')), ']') AS bids
          FROM procurement 
          INNER JOIN requisition ON procurement.requisition_id = requisition.requisition_id
          INNER JOIN bid ON procurement.procurement_id = bid.procurement_id
          INNER JOIN bid_product ON bid.bid_id = bid_product.bid_id
          INNER JOIN product ON product.product_id = bid_product.product_id
          INNER JOIN supplier ON bid.supplier_id = supplier.supplier_id
          WHERE procurement.bid_opening_team_id IN (SELECT bid_opening_team_id FROM bid_opening_team WHERE member_1='${employee_id}' OR member_2='${employee_id}') AND procurement.status='completed'
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
    getCompletedProcurements,
};