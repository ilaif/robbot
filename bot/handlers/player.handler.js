'use strict';

let playerDao = require('../dao/player.dao'),
    gamePlayerDao = require('../dao/game_player.dao'),
    GamePlayerStatus = require('../enums/GamePlayerStatus'),
    _ = require('lodash');

exports.addToGame = (game, playerAttributes) => {
    return playerDao.findOrCreate({telegramId: playerAttributes.telegramId}, playerAttributes)
        .spread((player, playerUpdated) => {
            let attributes = {playerId: player.id, gameId: game.id};
            return gamePlayerDao.findOrCreate(attributes, attributes)
                .spread((gamePlayer, gamePlayerUpdated) => [player, gamePlayerUpdated]);
        })
        .spread((player, gamePlayerUpdated) => [player, gamePlayerUpdated]);
};

exports.findPlayersInGroupByIdentifier = (players, identifier) => {

    if (identifier === '' || identifier == ' ') {
        return false;
    }

    identifier = identifier.trim();

    let n = parseInt(identifier);
    if (!isNaN(n)) {

        if (players.length <= n)
            return [];

        return [players[n]];
    }

    // Split in case its a full name
    let names = identifier.split(' ').map(n => n.toLowerCase());
    players = players.map(p => {
        p.firstName = p.firstName.toLowerCase();
        p.lastName = p.lastName.toLowerCase();
        return p;
    });

    if (names.length > 1) {
        return players.filter(p => {
            return ((p.firstName == names[0] && p.lastName == names[1]) ||
            (p.firstName == names[1] && p.lastName == names[0]) );
        });
    }
    else {
        return players.filter(p => {
            return (p.firstName == names[0] || p.lastName == names[0]);
        });
    }
};

exports.findByTelegramId = (telegramId) => {
    return playerDao.findOne({telegramId});
};

exports.findById = (id) => {
    return playerDao.findById(id);
};

exports.findGamePlayerById = (id) => {
    return gamePlayerDao.findOne({playerId: id});
};

exports.kickPlayer = (player) => {
    player.gamePlayer.status = GamePlayerStatus.OUT;
    return gamePlayerDao.save(player.gamePlayer);
};

exports.getPlaying = (players) => {
    return _.filter(players, (player) => {
        return player.gamePlayer.status === GamePlayerStatus.PLAYING;
    })
};

exports.findByGameId = (gameId) => {
    return playerDao.findByGameId(gameId);
};