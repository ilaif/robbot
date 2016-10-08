'use strict';

let UserInput = require('../models/user_input.model.js'),
    playerController = require('../controllers/player.controller');

module.exports = (bot) => {

    bot.onText(/\/join/, (msg, match) => {
        let userInput = new UserInput(msg, 'join', null);

        return playerController.join(bot, userInput);
    });

    bot.onText(/\/vote (.+)/, (msg, match) => {
        let userInput = new UserInput(msg, 'startVoteRound', match[1]);

        return playerController.startVoteRound(bot, userInput);
    });

    bot.onText(/\/(yes|no)/, (msg, match) => {
        let userInput = new UserInput(msg, 'vote', match[1]);

        return playerController.vote(bot, userInput);
    });
};