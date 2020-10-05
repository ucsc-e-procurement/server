require("dotenv").config({ path: "../.env" });

const config = require("./config");
const express = require("express");
const logger = require("./config/winston_config");

const loader = require("./loaders");

// Initialize Express App
const app = express();
const port = 5000;


async function startServer () {
  
  // const test = JSON.parse(str);
  // console.log(">>", test);
  // console.log("##", test.total);

  await loader(app);

  app.listen(config.port, (err) => {
    if (err) {
      logger.error(`Server Has Stopped Due to Error ${err}`);
      process.exit(1);

    }
    
    logger.info(`Server Has Started listening on PORT: ${config.port}`);
    console.log(`
      =====================================================================================
                          Server Has Started listening on PORT: ${config.port}
      =====================================================================================

    `);
  }
  
  );


}

startServer();


