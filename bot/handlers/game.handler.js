'use strict';

let gameDao = require('../dao/game.dao');

exports.isGameActive = (chatId) => {
    return !!gameDao.findGameByChatId(chatId);
};