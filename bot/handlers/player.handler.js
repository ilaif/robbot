'use strict';

let playerDao = require('../dao/player.dao'),
    gamePlayerDao = require('../dao/game_player.dao'),
    GamePlayerStatus = require('../enums/GamePlayerStatus'),
    _ = require('lodash'),
    IdAlreadyExistsError = require('../errors/db.error').IdAlreadyExistsError,
    Player = require('../models/player.model');

exports.addToGame = (game, playerData) => {
    try {

        let player = playerDao.create(playerData);
        let attributes = {playerId: player.id, gameId: game.id};
        let results = gamePlayerDao.findOrCreate(attributes, attributes);
        let created = results.created;
        let gamePlayer = results.instance;

        return {
            added: created,
            instance: player
        };

    } catch (e) {
        if (e instanceof IdAlreadyExistsError) {
            //TODO: Implement logger
            console.log('Player is already in the db');
        } else {
            throw e;
        }
    }
};

exports.findPlayersInGroupByIdentifier = (players, identifier) => {

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

exports.kickPlayer = (voteRound) => {
    let gamePlayer = gamePlayerDao.findOne({playerId: voteRound.playerId});
    gamePlayer.status = GamePlayerStatus.OUT;
    gamePlayerDao.update(gamePlayer);
};

exports.getPlaying = (players) => {
    return _.filter(players, {status: GamePlayerStatus.PLAYING})
};