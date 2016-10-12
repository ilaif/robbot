'use strict';

let TelegramBot = require('node-telegram-bot-api'),
    Promise = require('bluebird'),
    config = require('../config');

class BotClient {

    constructor(opts) {
        this._client = new TelegramBot(opts.botToken, {polling: opts.polling});
        this.name = null;
    }

    on(eventName, cb) {
        this._client.on(eventName, cb);
    }

    onNewChatParticipant(cb) {
        this.on('new_chat_participant', cb);
    }

    onLeftChatParticipant(cb) {
        this.on('left_chat_participant', cb);
    }

    onText(regex, cb) {
        this._client.onText(regex, cb);
    }

    sendMessage(recipientId, msg) {
        return this._client.sendMessage(recipientId, msg);
    }

    sendSticker(recipientId, sticker, opts) {
        return this._client.sendSticker(recipientId, sticker, opts);
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getMe() {
        return this._client.getMe();
    }
}

let bot = new BotClient({botToken: config.botToken, polling: true});

exports.getClient = () => bot;