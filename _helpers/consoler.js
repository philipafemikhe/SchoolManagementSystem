const fs = require('fs');
const { date } = require('joi');

const d_t = new Date();
let year = d_t.getFullYear();
let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
let day = ("0" + d_t.getDate()).slice(-2);

const outputLog = fs.createWriteStream('./logs/outputLog_' + year + month + day + '.log');
const errorsLog = fs.createWriteStream('./logs/errorsLog_' + year + month + day + '.log');
const consoler = new console.Console(outputLog, errorsLog);


module.exports = consoler;