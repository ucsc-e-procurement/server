require('dotenv').config({ path: '../.env' })

const config  = require('./config');
const express = require("express");

const loader = require("./loaders");

// Initialize Express App
const app = express();
const port = 5000;


async function startServer () {
  
  await loader(app);

  app.listen(config.port, (err) => {
    if (err) {
      process.exit(1);
    }
    console.log(`
      =====================================================================================
                          Server Has Started listening on PORT: ${config.port}
      =====================================================================================

    `);
  }
  
);


}

startServer();


