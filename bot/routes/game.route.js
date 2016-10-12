'use strict';

let gameController = require('../controllers/game.controller.js'),
    Route = require('../models/route.model'),
    Command = require('../enums/Command');

class GameRoute extends Route {
    constructor(opts) {
        super(opts);

        this.onText(/^\/new$|^\/new@/, (msg, match) => {
            return this.parseCommand(Command.NEW, {msg, match})
                .then(() => gameController.newGame(this.req, this.res))
                .then(this.catch);
        });

        this.onText(/^\/start$|^\/start@/, (msg, match) => {
            return this.parseCommand(Command.START, {msg, match})
                .then(() => gameController.startGame(this.req, this.res))
                .then(this.catch);
        });

        this.onText(/^\/cancel$|^\/cancel@/, (msg, match) => {
            return this.parseCommand(Command.CANCEL, {msg, match})
                .then(() => gameController.cancelGame(this.req, this.res))
                .then(this.catch);
        });
    }
}

module.exports = (client) => {
    new GameRoute({client});
};