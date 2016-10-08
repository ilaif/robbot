'use strict';

let voteDao = require('../dao/vote.dao.js'),
    gameDao = require('../dao/game.dao'),
    GameState = require('../enums/GameState'),
    voteRoundDao = require('../dao/vote_round.dao');

exports.startRound = (game, player) => {
    game = gameDao.updateAttributes(game, {round: game.round + 1, state: GameState.VOTE_ROUND});
    return voteRoundDao.create({gameId: game.id, playerId: player.id, round: game.round});
};

exports.getVoteRoundByGame = (game) => {
    return voteRoundDao.findOne({gameId: game.id, round: game.round});
};

exports.getVotesByRound = (voteRound) => {
    return voteDao.find({voteRoundId: voteRound.id});
};

exports.setVote = (vote, accepted) => {
    return voteDao.updateAttributes(vote, {accepted});
};

exports.voteResults = () => {

};

exports.vote = (voteRoundId, playerId, accepted) => {
    return voteDao.create({voteRoundId, playerId, accepted});
};