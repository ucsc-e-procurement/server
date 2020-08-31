const firebase = require("firebase");
const firebaseConfig = require("../config/firebase_config");
const logger = require("../config/winston_config");
const decryptedBidListener = require("../subscribers/decrypted_bid_listener");

module.exports = () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  db.collection("test_col").doc("health_check_doc").get().then(doc => {
    logger.info(">> Firebase Initialized | " + doc.data().message);
    decryptedBidListener();
  }).catch(err => {
    console.log(err);
  });
};