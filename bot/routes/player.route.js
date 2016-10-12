'use strict';

let playerController = require('../controllers/player.controller'),
    Route = require('../models/route.model'),
    Command = require('../enums/Command');

class PlayerRoute extends Route {
    constructor(opts) {
        super(opts);

        this.onText(/\/join/, (msg, match) => {
            return this.parseCommand(Command.JOIN, {msg, match})
                .then(() => playerController.join(this.req, this.res))
                .then(this.catch);
        });

        this.onText(/\/vote (.+)/, (msg, match) => {
            return this.parseCommand(Command.VOTE_ROUND, {msg, match})
                .then(() => playerController.startVoteRound(this.req, this.res))
                .then(this.catch);
        });

        this.onText(/\/(yes|no)/, (msg, match) => {
            return this.parseCommand(Command.VOTE, {msg, match})
                .then(() => playerController.vote(this.req, this.res))
                .then(this.catch);
        });

    }
}

module.exports = (client) => {
    new PlayerRoute({client});
};