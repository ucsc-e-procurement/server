// Imported Modules
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");
const appRoot = require("app-root-path");

const pad = num => (num > 9 ? "" : "0") + num;
const generator = (time, index) => {
  if (!time) return "file.log";
 
  var month = time.getFullYear() + "" + pad(time.getMonth() + 1);
  var day = pad(time.getDate());
  var hour = pad(time.getHours());
  var minute = pad(time.getMinutes());
 
  return `${month}/${month}${day}-${hour}${minute}-${index}-file.log`;
};

let tokenString = ":remote-addr | :remote-user | [:date[web]] | :method :url | HTTP/:http-version | :status | :res[content-length] | :referrer | :user-agent | :response-time ms | :total-time |";

// create a rotating write stream - create a new log file for each day
var accessLogStream = rfs.createStream("http.log", {
  interval: "1d", // rotate daily
  path: `${appRoot}/logs/http`
});
  
module.exports = morgan(tokenString, { stream: accessLogStream });