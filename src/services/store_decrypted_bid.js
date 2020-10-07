const BidModel = require("../models/bid_model");
const ProcurementModel = require("../models/procurement_model");
const logger = require("../config/winston_config");


module.exports = (firestoreDocJsonDataString) => {

  return new Promise((resolve, reject) => {
    console.log("################", firestoreDocJsonDataString);
    let jsonData = JSON.parse(firestoreDocJsonDataString);
    let items = [];

    jsonData.items.forEach(item => {
      items.push(JSON.parse(item));
    });

    console.log("@@@@@@@@@@@@@@", jsonData);
    console.log("@@@ @@@@@ @@@ @@@", items);
    let data = {
      items: items,
      total: parseFloat(jsonData.subTotal),
      total_with_vat: parseFloat(jsonData.total),
      procurement_id: "",
      bid_id: ""
    };

    BidModel.updateBidValues(data)
      .then(result => {
        console.log("Bid Table Updated", result);
        return BidModel.createBidProduct(data.bid_id, data.items[0]);
      })
      .then(result => {
        console.log("Bid Product Created", result);
      
      })
      .then(result => {
        console.log("Bid Table Updated", result);
        return ProcurementModel.updateProcurementStep(
          jsonData.procurement_id,
          7
        );
      }).then(() => {
        resolve({ message: "success"});
      })
      .catch(err => {
        console.log(err);
        logger.error(err);
        reject(err);
      });

  
  });
};