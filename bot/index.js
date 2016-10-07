'use strict';

var TelegramBot = require('node-telegram-bot-api');
var token = '294935473:AAGnEMyz5xbJ5YPwIAXi11b3tvoHxxgxOHU';
var bot = new TelegramBot(token, {polling: true});

bot.onText(/(.+)/, function (msg, match) {
    var fromId = msg.chat.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});