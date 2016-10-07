'use strict';

let TelegramBot = require('node-telegram-bot-api'),
    config = require('./config'),
    bot = new TelegramBot(config.botToken, {polling: true});

require('./routes')(bot);