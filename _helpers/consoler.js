const fs = require('fs');
const outputLog = fs.createWriteStream('./logs/outputLog.log');
const errorsLog = fs.createWriteStream('./logs/errorsLog.log');
const consoler = new console.Console(outputLog, errorsLog);


module.exports = consoler;