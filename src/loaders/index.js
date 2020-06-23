const expressLoader = require("./express");

module.exports = async (expressApp) => {
    // Loading Express
    await expressLoader( expressApp );
}