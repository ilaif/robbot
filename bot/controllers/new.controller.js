'use strict';

let gameHandler = require('../handlers/game.handler');

exports.newGame = (bot, message) => {

    let isGameActive = gameHandler.isGameActive(message.chatId);

    if (!isGameActive) {

    }

    return bot.sendMessage(message.chatId, `Game was: ${isGameActive}`);
};