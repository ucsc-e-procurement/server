const firebase = require("firebase");
const logger = require("../config/winston_config");
const storeDecryptedBidService = require("../services/store_decrypted_bid");

module.exports = () => {
  const db = firebase.firestore();

  const query = db.collection("decrypted_bids").where("is_processed", "==", false);
  logger.info("Listening for Decrypted Bids Begin...");

  const observer = query.onSnapshot(querySnapshot => {
    logger.info(`Received query snapshot of size ${querySnapshot.size}`);

    if(querySnapshot.empty){
      logger.info("No Decrypted Bid Documents Found");
    } else {
      querySnapshot.forEach(doc => {
        console.log(doc.data());

        // TODO Store Each Bid on the bid Table
        // storeDecryptedBidService(); 
      });
    }
  // ...
  }, err => {
    logger.error(`Decrypted Bid Listener Error(Firebase): ${err}`);
  });
};