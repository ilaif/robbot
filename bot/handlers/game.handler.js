'use strict';

let gameDao = require('../dao/game.dao'),
    gamePlayerDao = require('../dao/game_player.dao'),
    GameState = require('../enums/GameState'),
    GameStatus = require('../enums/GameStatus'),
    PlayerColor = require('../enums/PlayerColor'),
    utilsLib = require('../libs/utils.lib'),
    Game = require('../models/game.model');

exports.isActive = (chatId) => {
    let game = exports.getGameByChatId(chatId);
    return game && game.isActive();
};

exports.createNew = (chatId) => {
    let game = new Game({chatId});
    gameDao.save(game);
    return game;
};

exports.getGameByChatId = (chatId) => {
    return gameDao.findOne({chatId, status: GameStatus.ACTIVE});
};

exports.start = (game) => {
    game.state = GameState.ACTIVE;
    gameDao.update(game);

    let gamePlayers = gamePlayerDao.find({gameId: game.id});

    let countPlayers = gamePlayers.length;
    let numReds = Math.round(countPlayers / 3);
    let redIndexes = utilsLib.pickNRandomNumbersFromRange(numReds, 0, countPlayers);

    redIndexes.forEach(i => {
        gamePlayers[i].color = PlayerColor.RED;
        gamePlayerDao.update(gamePlayers[i]);
    });

    return gamePlayers;
};

exports.setState = (game, state) => {
    game.state = state;
    gameDao.update(game);
};

exports.finishGame = (game) => {
    game.status = GameStatus.FINISHED;
    game.state = GameState.FINISHED;
    gameDao.update(game);
};