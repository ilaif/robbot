'use strict';

let playerController = require('../controllers/player.controller'),
    Route = require('../models/route.model'),
    Command = require('../enums/Command');

class PlayerRoute extends Route {
    constructor(opts) {
        super(opts);

        this.onText(/^\/join$|^\/join@/, (msg, match) => {
            return this.parseCommand(Command.JOIN, {msg, match})
                .then(() => playerController.join(this.req, this.res))
                .then(this.catch);
        });

        this.onText(/^\/vote (.+)/, (msg, match) => {
            return this.parseCommand(Command.VOTE_ROUND, {msg, match})
                .then(() => playerController.startVoteRound(this.req, this.res))
                .then(this.catch);
        });

        this.onText(/^\/vote$|^\/vote@/, (msg, match) => {
            return this.parseCommand(null, {msg, match})
                .then(() => {
                    return this.res.sendMessage(this.req.chatId, `${this.req.from.firstName}: Use /vote <playerName> to start a vote against a player.`);
                })
                .then(this.catch);
        });

        this.onText(/^\/(yes|no)$|^\/(yes|no)@/, (msg, match) => {
            return this.parseCommand(Command.VOTE, {msg, match})
                .then(() => playerController.vote(this.req, this.res))
                .then(this.catch);
        });

    }
}

module.exports = (client) => {
    new PlayerRoute({client});
};