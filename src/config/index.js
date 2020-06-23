const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("Couldn't find .env file");
}

module.exports = {

    // PORT Which Application Runs On
    port: parseInt(process.env.PORT, 10),

    //  API Configs
    api: {
        prefix: '/api',
    }
};
