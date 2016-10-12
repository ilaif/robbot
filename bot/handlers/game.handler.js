'use strict';

let gameDao = require('../dao/game.dao');
let gamePlayerDao = require('../dao/game_player.dao');
let GameState = require('../enums/GameState');
let GameStatus = require('../enums/GameStatus');
let PlayerColor = require('../enums/PlayerColor');
let utilsLib = require('../libs/utils.lib');
let Promise = require('bluebird');

exports.isActive = (chatId) => {
    return exports.getGameByChatId(chatId)
        .then(game => {
            return game && game.isActive();
        });
};

exports.createNew = (chatId) => {
    return gameDao.createByChatId(chatId);
};

exports.getGameByChatId = (chatId) => {
    return gameDao.findActiveGameByChatId(chatId);
};

exports.start = (game) => {
    game.state = GameState.ACTIVE;

    return gameDao.save(game)
        .then(game => gamePlayerDao.find({gameId: game.id}))
        .then(gamePlayers => {
            let countPlayers = gamePlayers.length;
            let numReds = Math.round(countPlayers / 3);
            let redIndexes = utilsLib.pickNRandomNumbersFromRange(numReds, 0, countPlayers);

            let promises = redIndexes.map(i => {
                gamePlayers[i].color = PlayerColor.RED;
                return gamePlayerDao.save(gamePlayers[i]);
            });

            return Promise.all(promises)
                .then(results => gamePlayers);
        })
        .then(gamePlayers => {
            return gamePlayers;
        });
};

exports.setState = (game, state) => {
    game.state = state;
    return gameDao.save(game);
};

exports.finishGame = (game) => {
    game.status = GameStatus.FINISHED;
    game.state = GameState.FINISHED;
    return gameDao.save(game);
};

exports.cancelGame = (game) => {
    game.status = GameStatus.CANCELLED;
    game.state = GameState.CANCELLED;
    return gameDao.save(game);
};