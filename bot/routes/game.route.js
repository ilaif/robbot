'use strict';

let UserInput = require('../models/user_input.model.js'),
    gameController = require('../controllers/game.controller.js');

module.exports = (bot) => {

    bot.onText(/\/new/, (msg, match) => {
        let userInput = new UserInput(msg, 'new', null);

        return gameController.newGame(bot, userInput);
    });

    bot.onText(/\/start/, (msg, match) => {
        let userInput = new UserInput(msg, 'start', null);

        return gameController.startGame(bot, userInput);
    });

};