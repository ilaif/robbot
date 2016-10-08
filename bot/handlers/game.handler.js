'use strict';

let gameDao = require('../dao/game.dao'),
    gamePlayerDao = require('../dao/game_player.dao'),
    GameState = require('../enums/GameState'),
    PlayerColor = require('../enums/PlayerColor'),
    utilsLib = require('../libs/utils.lib'),
    Game = require('../models/game.model');

exports.isActive = (chatId) => {
    let game = gameDao.findGameByChatId(chatId);
    return game && game.isActive();
};

exports.createNew = (chatId) => {
    let game = new Game({chatId});
    gameDao.save(game);
    return game;
};

exports.getGameByChatId = (chatId) => {
    return gameDao.findGameByChatId(chatId);
};

exports.start = (game) => {
    game.state = GameState.ACTIVE;
    gameDao.update(game);

    let gamePlayers = gamePlayerDao.find({gameId: game.id});

    let countPlayers = gamePlayers.length;
    let numReds = Math.round(countPlayers / 3);
    let redIndexes = utilsLib.pickNRandomNumbersFromRange(numReds, 0, countPlayers - 1);

    redIndexes.forEach(i => {
        gamePlayers[i].color = PlayerColor.RED;
        gamePlayerDao.update(gamePlayers[i]);
    });

    return gamePlayers;
};