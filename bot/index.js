'use strict';

let env = process.env;
env.TZ = 'UTC';

let botLib = require('./libs/bot.lib');
let logger = require('./libs/logger.lib');
let config = require('./config');
let dataModels = require('./data_models');
let Promise = require('bluebird');

if (!env.NODE_ENV) env.NODE_ENV = 'development';

Promise.onPossiblyUnhandledRejection(err => {
    logger.error(err, 'An UNCAUGHT EXCEPTION occurred');
});

process.on('uncaughtException', (err) => {
    logger.error(err, 'An UNCAUGHT EXCEPTION occurred');
});

// First sync db
dataModels.sequelize.sync({sync: config.db.forceSync})
    .then(() => {

        require('./routes')(botLib.getClient());

        console.log('Rob is up! Listening for messages...');
        console.log('Environment:', env.NODE_ENV);
    });
