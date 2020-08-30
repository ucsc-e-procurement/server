const BidModel = require("../models/bid_model");
const ProcurementModel = require("../models/procurement_model");
const logger = require("../config/winston_config");


module.exports = async (firestoreDocJsonDataString) => {
  try {
    let jsonData = JSON.parse(firestoreDocJsonDataString);
  
    await BidModel.createBid(jsonData);
    await ProcurementModel.updateProcurementStep(
      jsonData.procurement_id,
      7
    );
  
    logger.info({ message: "success", jsonData: jsonData });
  } catch (error) {
    logger.error(error);
  
        
  }
};