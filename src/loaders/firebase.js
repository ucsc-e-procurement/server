const firebase = require("firebase");
const firebaseConfig = require("../config/firebase_config");

module.exports = () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  db.collection("test_col").doc("aWxxPrmXOoiYPs1vmDew").get().then(doc => {
    console.log("Huuuuuuuuuuuuuuurrrrrrraaaaaaaaaaaaayyyyyyyyyyyyyyyyyy", doc.data());
  }).catch(err => {
    console.log(err);
  });
};