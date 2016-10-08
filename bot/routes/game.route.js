'use strict';

let gameController = require('../controllers/game.controller.js'),
    Route = require('../models/route.model'),
    inputHandler = require('../handlers/input.handler'),
    Command = require('../enums/Command');

class GameRoute extends Route {
    constructor(opts) {
        super(opts);

        this.onText(/\/new/, (msg, match) => {
            let req = inputHandler.parseCommand(Command.NEW, {msg, match});
            gameController.newGame(req, this.res);
        });


        this.onText(/\/start/, (msg, match) => {
            let req = inputHandler.parseCommand(Command.START, {msg, match});
            gameController.startGame(req, this.res);
        });
    }
}

module.exports = (client) => {
    new GameRoute({client});
};