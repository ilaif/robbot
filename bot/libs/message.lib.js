'use strict';

exports.sendMessage = (bot, recipientId, msg) => {

    return bot.sendMessage(recipientId, msg);
};