'use strict';

let playerController = require('../controllers/player.controller'),
    Route = require('../models/route.model'),
    inputHandler = require('../handlers/input.handler'),
    Command = require('../enums/Command');

class PlayerRoute extends Route {
    constructor(opts) {
        super(opts);

        this.onText(/\/join/, (msg, match) => {
            let req = inputHandler.parseCommand(Command.JOIN, {msg, match});
            playerController.join(req, this.res);
        });

        this.onText(/\/vote (.+)/, (msg, match) => {
            let req = inputHandler.parseCommand(Command.VOTE_ROUND, {msg, match});
            playerController.startVoteRound(req, this.res);
        });

        this.onText(/\/(yes|no)/, (msg, match) => {
            let req = inputHandler.parseCommand(Command.VOTE, {msg, match});
            playerController.vote(req, this.res);
        });

    }
}

module.exports = (client) => {
    new PlayerRoute({client});
};