'use strict';

let botLib = require('./libs/bot.lib');

require('./routes')(botLib.getClient());