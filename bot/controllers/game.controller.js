'use strict';

let gameHandler = require('../handlers/game.handler'),
    playerHandler = require('../handlers/player.handler'),
    GameState = require('../enums/GameState'),
    _ = require('lodash'),
    PlayerColor = require('../enums/PlayerColor'),
    config = require('../config'),
    msgLib = require('../libs/message.lib');

exports.newGame = (bot, userInput) => {

    let isGameActive = gameHandler.isActive(userInput.chatId);

    if (isGameActive) {

        return msgLib.sendMessage(bot, userInput.chatId, `Game is already active`);
    }
    else {

        msgLib.sendMessage(bot, userInput.chatId, `Initializing a new game :)`);

        let game = gameHandler.createNew(userInput.chatId);

        msgLib.sendMessage(bot, userInput.chatId, `Type '/join' to join the game`);
    }
};

exports.startGame = (bot, userInput) => {

    let isGameActive = gameHandler.isActive(userInput.chatId);
    if (!isGameActive)
        return msgLib.sendMessage(bot, userInput.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(userInput.chatId);

    if (game.state == GameState.INIT) {

        if (game.players.length < 3 && !config.noRules) {
            let playerNames = game.players.map(p => p.firstName).join(', ');
            let joinedPlayers = game.players.length > 0 ? ` Currently ${playerNames} have joined.` : ` Nobody is joined`;
            return msgLib.sendMessage(bot, userInput.chatId, `Less than 3 players joined the game. ${joinedPlayers}`);
        }

        let gamePlayers = gameHandler.start(game);
        let players = gamePlayers.map(gamePlayer => playerHandler.findById(gamePlayer.playerId));
        let playersById = _.keyBy(players, 'id');

        // Notify all players

        let playersInfo = gamePlayers.map((gamePlayer, i) => {
            let player = playersById[gamePlayer.playerId];
            return `${i} - ${player.firstName} ${player.lastName}: ${_.upperFirst(gamePlayer.color)}`;
        }).join('\n');

        gamePlayers.forEach(gamePlayer => {
            if (gamePlayer.color == PlayerColor.RED) {
                msgLib.sendMessage(bot, gamePlayer.playerId, `Congratulations! You are red!\nPlayers Info\n${playersInfo}`)
            } else {
                msgLib.sendMessage(bot, gamePlayer.playerId, `You are black - Good luck! ^^`)
            }
        });

        return msgLib.sendMessage(bot, userInput.chatId, `Game started, good luck :D`);
    }
    else {
        return msgLib.sendMessage(bot, userInput.chatId, `You cannot start the game at this point.`);
    }
};