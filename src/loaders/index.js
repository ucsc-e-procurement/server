const expressLoader = require("./express");
const firebaseInitializer = require("./firebase");

module.exports = async (expressApp) => {
  // Loading Express
  await expressLoader(expressApp);
  await firebaseInitializer();
};
