'use strict';

let playerDao = require('../dao/player.dao'),
    gamePlayerDao = require('../dao/game_player.dao'),
    GamePlayerStatus = require('../enums/GamePlayerStatus'),
    _ = require('lodash');

exports.addToGame = (game, playerData) => {
    let results = playerDao.findOrCreate(playerData, playerData);
    let player = results.instance;
    let playerCreated = results.created;
    let attributes = {playerId: player.id, gameId: game.id};
    results = gamePlayerDao.findOrCreate(attributes, attributes);
    let gamePlayer = results.instance;
    let gamePlayerCreated = results.created;

    return {
        added: gamePlayerCreated,
        instance: player
    };
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

exports.findById = (id) => {
    return playerDao.findById(id);
};

exports.findGamePlayerById = (id) => {
    return gamePlayerDao.findOne({playerId: id});
};

exports.kickPlayer = (voteRound) => {
    let gamePlayer = gamePlayerDao.findOne({playerId: voteRound.playerId});
    gamePlayer.status = GamePlayerStatus.OUT;
    gamePlayerDao.update(gamePlayer);
};

exports.getPlaying = (players) => {
    return _.filter(players, {status: GamePlayerStatus.PLAYING})
};

//TODO: Not working
exports.findByGameId = (gameId) => {
    return playerDao.find({gameId});
};

exports.findByIds = (idList) => {
    return idList.map(id => exports.findById(id));
};

exports.findGamePlayersByGameId = (gameId) => {
    return gamePlayerDao.find({gameId});
};