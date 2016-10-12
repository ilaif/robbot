'use strict';

let Request = require('../models/request.model.js');
let Promise = require('bluebird');
let playerHandler = require('../handlers/player.handler');
let gameHandler = require('../handlers/game.handler');

exports.parseCommand = (cmd, opts) => {
    return new Promise((resolve, reject) => {

        let msg = opts.msg,
            match = opts.match;

        let input = null;
        if (match.length > 1)
            input = match[1];

        let req = {
            chatId: msg.chat.id,
            cmd: cmd,
            input: input,
            from: {}
        };

        if (msg.from) {
            req.from = {
                id: msg.from.id,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name
            };
        }

        return Promise.all([
                gameHandler.getGameByChatId(req.chatId),
                playerHandler.findByTelegramId(req.from.id)
            ])
            .spread((game, player) => {
                if (game)
                    return playerHandler.findByGameId(game.id)
                        .then(players => [game, player, players]);
                else
                    return Promise.resolve([game, player, null]);
            })
            .spread((game, player, players) => {
                req.game = game;
                req.player = player;
                req.players = players;
                resolve(new Request({msg, cmd, input, game, player, players}));
            });
    });
};