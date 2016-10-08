'use strict';

let TelegramBot = require('node-telegram-bot-api'),
    Promise = require('bluebird'),
    config = require('../config');

class BotClient {

    constructor(opts) {
        this._client = new TelegramBot(opts.botToken, {polling: opts.polling});
    }

    onText(regex, cb) {
        this._client.onText(regex, cb);
    }

    sendMessage(recipientId, msg) {
        this._client.sendMessage(recipientId, msg);
    }
}

let bot = new BotClient({botToken: config.botToken, polling: true});

exports.getClient = () => bot;