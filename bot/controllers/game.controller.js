'use strict';

let gameHandler = require('../handlers/game.handler');
let playerHandler = require('../handlers/player.handler');
let GameState = require('../enums/GameState');
let _ = require('lodash');
let PlayerColor = require('../enums/PlayerColor');
let msgHandler = require('../handlers/message.handler');
let config = require('../config');

exports.newGame = (req, res) => {

    if (req.isGameActive())
        return res.sendMessage(req.chatId, `${req.from.firstName}: Game is already active`);

    res.sendMessage(req.chatId, `Initializing a new game :)`);

    return gameHandler.createNew(req.chatId)
        .then(game => {
            return res.sendMessage(req.chatId, `Everyone can type '/join' to join the game`);
        });
};

exports.startGame = (req, res) => {

    if (!req.isGameActive())
        return res.sendMessage(req.chatId, `${req.from.firstName}: There's no active game, type /new to start a new game.`);

    if (!req.isPlayerInGame())
        return res.sendMessage(req.chatId, `${req.from.firstName}: You did not join the game, so you can't make actions in it.`);

    let game = req.game;

    if (game.state == GameState.INIT) {

        let players = req.players;

        if (players.length < 3 && !config.noRules) {
            let playerNames = players.map(p => p.firstName).join(', ');
            let joinedPlayers = players.length > 0 ? `Currently ${playerNames} have joined.` : ` Nobody is joined`;
            return res.sendMessage(req.chatId, `${req.from.firstName}: Less than 3 players joined the game. ${joinedPlayers}`);
        }

        return gameHandler.start(game)
            .then(gamePlayers => {
                // Notify all players

                let gamePlayersById = _.keyBy(gamePlayers, 'playerId');

                let playersInfo = players.map((player, i) => {
                    return `${i} - ${player.fullName()}: ${_.upperFirst(player.gamePlayer.color)}`;
                }).join('\n');

                players.forEach(player => {
                    player.gamePlayer.color = gamePlayersById[player.id].color;

                    if (player.gamePlayer.color == PlayerColor.RED) {
                        res.sendMessage(player.telegramId, `Congratulations! You are red!\nPlayers Info\n${playersInfo}`);
                    } else {
                        let hiddenPlayersInfo = players.map((curPlayer, i) => {
                            let color = player.id == curPlayer.id ? player.gamePlayer.color : '?';
                            return `${i} - ${curPlayer.fullName()}: ${color}`;
                        }).join('\n');
                        res.sendMessage(player.telegramId, `You are black - Good luck! ^^\nPlayers Info\n${hiddenPlayersInfo}`);
                    }
                });

                return res.sendMessage(req.chatId, `Game started, good luck :D`);
            });
    }
    else {
        return res.sendMessage(req.chatId, `${req.from.firstName}: You cannot start the game at this point. ${msgHandler.parseCurrentGameState(game.state)}`);
    }
};

exports.cancelGame = (req, res) => {

    if (!req.isGameActive())
        return res.sendMessage(req.chatId, `${req.from.firstName}: There's no active game, type /new to start a new game.`);

    //if (!req.isPlayerInGame())
    //    return res.sendMessage(req.chatId, `${req.from.firstName}: You did not join the game, so you can't make actions in it.`);

    let game = req.game;

    if (~[GameState.CANCELLED, GameState.FINISHED].indexOf(game.state)) {
        return res.sendMessage(req.chatId, `${req.from.firstName}: You cannot cancel the game at this point. ${msgHandler.parseCurrentGameState(game.state)}`);
    }
    else {
        return gameHandler.cancelGame(game)
            .then(() => {
                return res.sendMessage(req.chatId, `Game was cancelled successfully.`);
            });
    }
};