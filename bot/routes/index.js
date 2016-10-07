/**
 * Author [bend]
 */

'use strict';

var fs = require('fs'),
    path = require('path');

//load all cron jobs scripts
module.exports = (opts) => fs
    .readdirSync(__dirname)
    .filter((file) => (file.indexOf(".") !== -1) && (file !== "index.js"))
    .forEach((file) => require(path.join(__dirname, file))(opts));