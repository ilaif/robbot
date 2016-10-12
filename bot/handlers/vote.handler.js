'use strict';

let voteDao = require('../dao/vote.dao.js'),
    gameDao = require('../dao/game.dao'),
    GameState = require('../enums/GameState'),
    voteRoundDao = require('../dao/vote_round.dao');

exports.startRound = (game, player) => {
    game.round += 1;
    game.state = GameState.VOTE_ROUND;

    return gameDao.save(game)
        .then(game => {
            return voteRoundDao.create({gameId: game.id, playerId: player.id, round: game.round});
        });
};

exports.getVoteRoundByGame = (game) => {
    return voteRoundDao.findWithVotesByGameIdRound(game.id, game.round);
};

exports.setVote = (vote, accepted) => {
    vote.accepted = accepted;
    return voteDao.save(vote);
};

exports.vote = (voteRoundId, playerId, accepted) => {
    return voteDao.create({voteRoundId, playerId, accepted});
};