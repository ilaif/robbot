'use strict';

let gameHandler = require('../handlers/game.handler'),
    GameState = require('../enums/GameState'),
    Vote = require('../enums/Vote'),
    PlayerColor = require('../enums/PlayerColor'),
    msgHandler = require('../handlers/message.handler'),
    Promise = require('bluebird'),
    playerHandler = require('../handlers/player.handler'),
    voteHandler = require('../handlers/vote.handler'),
    _ = require('lodash');

exports.join = (req, res) => {

    if (!req.isGameActive())
        return res.sendMessage(req.chatId, `${req.from.firstName}: There's no active game, type /new to start a new game.`);

    let game = req.game;

    if (game.state == GameState.INIT) {

        let playerAttributes = {
            telegramId: req.from.id,
            firstName: req.from.firstName,
            lastName: req.from.lastName
        };

        return playerHandler.addToGame(game, playerAttributes)
            .spread((player, wasAdded) => {
                if (wasAdded) {
                    return res.sendMessage(req.chatId, `Good luck ${player.firstName}, you have successfully joined the game.`);
                } else {
                    return res.sendMessage(req.chatId, `${req.from.firstName}: You are already subscribed you silly one ^^.`);
                }
            });

    }
    else {
        return res.sendMessage(req.chatId, `${req.from.firstName}: You cannot join the game at this point. ${msgHandler.parseCurrentGameState(game.state)}`);
    }
};

let getPlayerNamesWithIds = (players) => players.map((p, i) => `${i} - ${p.fullName()}`);

exports.startVoteRound = (req, res) => {

    if (!req.isGameActive())
        return res.sendMessage(req.chatId, `${req.from.firstName}: There's no active game, type /new to start a new game.`);

    if (!req.isPlayerInGame())
        return res.sendMessage(req.chatId, `${req.from.firstName}: You did not join the game, so you can't make actions in it.`);

    let game = req.game;

    if (game.state == GameState.ACTIVE) {

        let playerIdentifier = req.input;
        let players = req.players;

        let playingPlayers = playerHandler.getPlaying(players);
        let votedPlayers = playerHandler.findPlayersInGroupByIdentifier(playingPlayers, playerIdentifier);
        let names = getPlayerNamesWithIds(playingPlayers).join('\n');

        if (votedPlayers === false) {
            return res.sendMessage(req.chatId, `${req.from.firstName}: Could not parse player name, please type /vote <player Id or Name>`)
        }
        else if (votedPlayers.length == 0) {
            return res.sendMessage(req.chatId, `${req.from.firstName}: Player name not found, please choose from the following list:\n${names}`);
        }
        else if (votedPlayers.length > 1) {
            return res.sendMessage(req.chatId, `${req.from.firstName}: Multiple results for player, please write it accurately or use player id:\n${names}`);
        }
        else {
            let player = votedPlayers[0];

            return voteHandler.startRound(game, player)
                .then(voteRound => {
                    return res.sendMessage(req.chatId, `${player.fullName()} is up for a vote! Is he Black or Red??? Make your discussions and vote by typing /yes or /no.`);
                });
        }
    }
    else {
        return res.sendMessage(req.chatId, `${req.from.firstName}: You cannot vote a player at this point. ${msgHandler.parseCurrentGameState(game.state)}`);
    }
};

function getVoteStatusStr(acceptedVotes, rejectedVotes) {
    return `Status:\nIn favor: ${acceptedVotes.length}\nAgainst: ${rejectedVotes.length}`;
}

function updateLocalVotes(vote, votes, acceptedVotes, rejectedVotes) {
    _.remove(votes, v => v.id === vote.id);
    _.remove(acceptedVotes, v => v.id === vote.id);
    _.remove(rejectedVotes, v => v.id === vote.id);

    votes.push(vote);
    if (vote.accepted)
        acceptedVotes.push(vote);
    else
        rejectedVotes.push(vote);
}

exports.vote = (req, res)=> {

    if (!req.isGameActive())
        return res.sendMessage(req.chatId, `${req.from.firstName}: There's no active game, type /new to start a new game.`);

    if (!req.isPlayerInGame())
        return res.sendMessage(req.chatId, `${req.from.firstName}: You did not join the game, so you can't make actions in it.`);

    let game = req.game;

    if (game.state == GameState.VOTE_ROUND) {

        // TODO: Service:
        return voteHandler.getVoteRoundByGame(game)
            .then(voteRound => {

                let votes = voteRound.votes;
                let vote = _.find(votes, {playerId: req.player.id});
                let inputVote = req.input == 'yes';
                let players = req.players;
                let playingPlayers = playerHandler.getPlaying(players);
                let numPlayers = playingPlayers.length;
                let acceptedVotes = _.filter(votes, {accepted: true});
                let rejectedVotes = _.filter(votes, {accepted: false});

                if (vote && inputVote == vote.accepted) {
                    return res.sendMessage(req.chatId, `${req.from.firstName}: You have already voted /${vote.accepted ? 'yes' : 'no'} for this vote round.`);
                }

                return new Promise((resolve, reject) => {
                    if (vote) {
                        let newDecision = !vote.accepted;
                        return voteHandler.setVote(vote, newDecision)
                            .then(vote => {
                                updateLocalVotes(vote, votes, acceptedVotes, rejectedVotes);
                                res.sendMessage(req.chatId, `${req.from.firstName}: Your vote was changed successfully! ${getVoteStatusStr(acceptedVotes, rejectedVotes)}`);
                                resolve(vote);
                            });
                    }
                    else {
                        return voteHandler.vote(voteRound.id, req.player.id, inputVote)
                            .then(vote => {
                                updateLocalVotes(vote, votes, acceptedVotes, rejectedVotes);
                                resolve(vote);
                            });
                    }
                }).then(vote => {
                    if (!vote) return;

                    let votedPlayer = _.filter(playingPlayers, {id: voteRound.playerId})[0];

                    // Check if there's a majority of votes
                    if (acceptedVotes.length > (numPlayers / 2)) {
                        return playerHandler.kickPlayer(votedPlayer)
                            .then(gamePlayer => {
                                _.remove(playingPlayers, player => player.id == voteRound.playerId);
                                return playerHandler.findById(voteRound.playerId);
                            })
                            .then(player => {
                                res.sendMessage(req.chatId, `Vote ended: kicking ${player.fullName()} out of the game! Final ${getVoteStatusStr(acceptedVotes, rejectedVotes)}`);

                                function getWinningTeam(color) {
                                    let winning = playingPlayers.filter(p => p.gamePlayer.color == color);
                                    return winning.map(p => p.fullName()).join(', ');
                                }

                                // Check if game ended
                                let results = _.partition(playingPlayers, player => player.gamePlayer.color === PlayerColor.RED);
                                if (results[0].length == results[1].length) {
                                    return gameHandler.finishGame(game)
                                        .then(game => res.sendMessage(req.chatId, `The reds win! Winning team: ${getWinningTeam(PlayerColor.RED)}`));
                                }
                                else if (results[0].length == 0) {
                                    return gameHandler.finishGame(game)
                                        .then(game => res.sendMessage(req.chatId, `The blacks win! Winning team: ${getWinningTeam(PlayerColor.BLACK)}`));
                                }
                                else {
                                    return gameHandler.setState(game, GameState.ACTIVE)
                                        .then(game => res.sendMessage(req.chatId, `Game is still ON!!!`));
                                }
                            });
                    }
                    else if (rejectedVotes.length > (numPlayers / 2)) {
                        let msg = `Vote ended: Decision is to leave ${votedPlayer.fullName()} in the game. Final ${getVoteStatusStr(acceptedVotes, rejectedVotes)}`;
                        return gameHandler.setState(game, GameState.ACTIVE)
                            .then(game => res.sendMessage(req.chatId, msg));
                    }
                    else {
                        let msg = `${req.from.firstName}: Thanks for voting! ${getVoteStatusStr(acceptedVotes, rejectedVotes)}`;
                        return res.sendMessage(req.chatId, msg);
                    }
                });
            });

    }
    else {
        return res.sendMessage(req.chatId, `${req.from.firstName}: You cannot make a voting decision at this point. ${msgHandler.parseCurrentGameState(game.state)}`);
    }
};