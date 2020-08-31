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
    let rawStr = "{\"items\":[\"{\"prod_id\":\"prod5\",\"description\":\"60GSM A4 printer quality paper \",\"qty\":\"10\",\"figures\":0,\"vat\":0,\"discount\":0,\"make\":\"-\",\"date\":\"2020-08-30\",\"validity\":0,\"credit\":0}\"],\"subTotal\":\"0\",\"total\":\"0\"}";
    console.log("######### ", rawStr);
    let temp = String(rawStr);
    console.log("#### ##### ", temp);


    // let str = JSON.stringify(temp);
    // str = str.replace(/\\/, "");
    // str = str.replace(/\\/, "");

    console.log("@@: ", JSON.parse(temp));
  }
  
  );


}

startServer();


