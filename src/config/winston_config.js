var appRoot = require("app-root-path");
var winston = require("winston");


/* define the configuration settings for the file and console 
   transports in the winston configuration as follows 
   * define the custom settings for each transport (file, console)
*/
var options = {
  fileInfo: {
    level: "info",
    filename: `${appRoot}/logs/general/info.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    timestamp: true
  },
  fileError: {
    level: "error",
    filename: `${appRoot}/logs/general/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    timestamp: true
  },
  fileWarn: {
    level: "warn",
    filename: `${appRoot}/logs/general/warn.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    timestamp: true
  },
  fileDebug: {
    level: "debug",
    filename: `${appRoot}/logs/general/debug.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    timestamp: true
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const logFormat_1 = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logFormat_2 = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level} | ${message}`;
});

// const logFormat = winston.format.combine(
//   winston.format.timestamp({
//     format: "YYYY-MM-DD HH:mm:ss.SSS"
//   }),
//   new TimestampFirst(true),
//   winston.format.json()
// );

/*  instantiate a new winston logger with file and console transports using the 
    properties defined in the options variable */
    
var logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat_2,
    // winston.format.prettyPrint(),
    // winston.format.json()
  ),
  transports: [
    new winston.transports.File(options.fileInfo),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

/* By default, morgan outputs to the console only, so let’s define a stream function that will be able to get morgan-generated output into the winston log files. We will use the info level so the 
     output will be picked up by both transports (file and console) */
logger.stream = {
  // create a stream object with a 'write' function that will be used by `morgan`
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

//   export the logger so it can be used in other parts of the application
module.exports = logger;
