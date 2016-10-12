'use strict';

var bunyan = require('bunyan');
var config = require('../config');

let options = {
    name: config.name,
    src: config.log.src,
    level: config.log.level,
    streams: [],
    serializers: bunyan.stdSerializers
};

if (config.log.console)
    options.streams.push({
        stream: process.stdout,
        //level: config.log.console.level
    });

if (config.log.file)
    options.streams.push({
        path: config.log.file.path,
        //level: config.log.file.level,
        type: 'file'
    });

let logger = bunyan.createLogger(options);

module.exports = logger;