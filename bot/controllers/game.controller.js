'use strict';

let gameHandler = require('../handlers/game.handler'),
    playerHandler = require('../handlers/player.handler'),
    GameState = require('../enums/GameState'),
    _ = require('lodash'),
    PlayerColor = require('../enums/PlayerColor'),
    config = require('../config');

exports.newGame = (req, res) => {

    let isGameActive = gameHandler.isActive(req.chatId);

    if (isGameActive) {
        return res.sendMessage(req.chatId, `Game is already active`);
    }
    else {
        res.sendMessage(req.chatId, `Initializing a new game :)`);

        let game = gameHandler.createNew(req.chatId);

        return res.sendMessage(req.chatId, `Type '/join' to join the game`);
    }
};

exports.startGame = (req, res) => {

    let isGameActive = gameHandler.isActive(req.chatId);
    if (!isGameActive)
        return res.sendMessage(req.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(req.chatId);

    if (game.state == GameState.INIT) {

        let gamePlayers = playerHandler.findGamePlayersByGameId(game.id);
        let players = playerHandler.findByIds(gamePlayers.map(gp => gp.playerId));

        if (players.length < 3 && !config.noRules) {
            let playerNames = players.map(p => p.firstName).join(', ');
            let joinedPlayers = players.length > 0 ? ` Currently ${playerNames} have joined.` : ` Nobody is joined`;
            return res.sendMessage(req.chatId, `Less than 3 players joined the game. ${joinedPlayers}`);
        }

        let playersById = _.keyBy(players, 'id');

        gameHandler.start(game);

        // Notify all players

        let playersInfo = gamePlayers.map((gamePlayer, i) => {
            let player = playersById[gamePlayer.playerId];
            return `${i} - ${player.firstName} ${player.lastName}: ${_.upperFirst(gamePlayer.color)}`;
        }).join('\n');

        let hiddenPlayersInfo = gamePlayers.map((gamePlayer, i) => {
            //TODO: Don't hide own user
            let player = playersById[gamePlayer.playerId];
            return `${i} - ${player.firstName} ${player.lastName}: ?`;
        }).join('\n');

        gamePlayers.forEach(gamePlayer => {
            if (gamePlayer.color == PlayerColor.RED) {
                res.sendMessage(gamePlayer.playerId, `Congratulations! You are red!\nPlayers Info\n${playersInfo}`);
            } else {
                res.sendMessage(gamePlayer.playerId, `You are black - Good luck! ^^\nPlayers Info\n${hiddenPlayersInfo}`);
            }
        });

        return res.sendMessage(req.chatId, `Game started, good luck :D`);
    }
    else {
        return res.sendMessage(req.chatId, `You cannot start the game at this point.`);
    }
};