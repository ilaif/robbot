'use strict';

let Message = require('../models/message.model'),
    newController = require('../controllers/new.controller');

module.exports = (bot) => {

    bot.onText(/\/new/, (msg, match) => {
        let message = new Message(msg, match);

        return newController.newGame(bot, message);
    });

};