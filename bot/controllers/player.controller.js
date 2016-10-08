'use strict';

let gameHandler = require('../handlers/game.handler'),
    GameState = require('../enums/GameState'),
    Vote = require('../enums/Vote'),
    PlayerColor = require('../enums/PlayerColor'),
    playerHandler = require('../handlers/player.handler'),
    voteHandler = require('../handlers/vote.handler'),
    _ = require('lodash');

//TODO: Add general exception with message to group

exports.join = (req, res) => {

    let isGameActive = gameHandler.isActive(req.chatId);

    if (!isGameActive)
        return res.sendMessage(req.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(req.chatId);

    if (game.state == GameState.INIT) {

        let playerData = req.from;

        let result = playerHandler.addToGame(game, playerData);

        if (result.added) {
            return res.sendMessage(req.chatId, `Good luck ${result.instance.firstName}, you have successfully joined the game.`);
        } else {
            return res.sendMessage(req.chatId, `You are already subscribed you silly one ^^.`);
        }
    }
    else {
        return res.sendMessage(req.chatId, `You cannot join the game at this point.`);
    }
};

let playerNamesWithIds = (players) => players.map((p, i) => `${i} - ${p.firstName} ${p.lastName}`);

exports.startVoteRound = (req, res) => {

    let isGameActive = gameHandler.isActive(req.chatId);

    if (!isGameActive)
        return res.sendMessage(req.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(req.chatId);

    if (game.state == GameState.ACTIVE) {

        let playerIdentifier = req.input;
        let gamePlayers = playerHandler.findGamePlayersByGameId(game.id);
        let playingGamePlayers = playerHandler.getPlaying(gamePlayers);
        let playingPlayers = playerHandler.findByIds(playingGamePlayers.map(pgp => pgp.playerId));
        let players = playerHandler.findPlayersInGroupByIdentifier(playingPlayers, playerIdentifier);
        let names = playerNamesWithIds(playingPlayers).join('\n');

        if (players === false) {
            return res.sendMessage(req.chatId, `Could not parse player name, please type /vote <player Id or Name>`)
        }
        else if (players.length == 0) {
            return res.sendMessage(req.chatId, `No player names found, please choose from this list:\n${names}`);
        }
        else if (players.length > 1) {
            return res.sendMessage(req.chatId, `Multiple results for player, please write it accurately or use player id:\n${names}`);
        }
        else {
            let name = `${players[0].firstName} ${players[0].lastName}`;
            let player = players[0];

            let voteRound = voteHandler.startRound(game, player);

            return res.sendMessage(req.chatId, `${name} is up for a vote! Is he Black or Red??? Make your discussions and vote by typing /yes or /no.`);
        }
    }
    else {
        return res.sendMessage(req.chatId, `You cannot vote a player at this point.`);
    }
};

//TODO: Add player names or users when replying to them.

exports.vote = (req, res)=> {

    let isGameActive = gameHandler.isActive(req.chatId);

    if (!isGameActive)
        return res.sendMessage(req.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(req.chatId);

    if (game.state == GameState.VOTE_ROUND) {

        // TODO: Service:
        let voteRound = voteHandler.getVoteRoundByGame(game);
        let votes = voteHandler.getVotesByRound(voteRound);
        let vote = _.find(votes, {playerId: req.from.id});

        if (vote) {
            if (req.input == vote.accepted) {
                return res.sendMessage(req.chatId, `You have already voted /${vote.accepted} for this vote round.`);
            } else {
                voteHandler.setVote(vote, !vote.accepted);
                res.sendMessage(req.chatId, `Your vote was changed successfully!`);
            }
        }
        else {
            let accepted = req.input === 'yes';
            vote = voteHandler.vote(voteRound.id, req.from.id, accepted);
            votes.push(vote); // Updating local state
        }

        let gamePlayers = playerHandler.findGamePlayersByGameId(game.id);
        let playingGamePlayers = playerHandler.getPlaying(gamePlayers);
        let numPlayers = gamePlayers.length;
        let acceptedVotes = _.filter(votes, {accepted: true});

        // Check if there's a majority of votes
        if (acceptedVotes.length > (numPlayers / 2)) {
            playerHandler.kickPlayer(voteRound);
            _.remove(playingGamePlayers, gp => {
                return gp.playerId == voteRound.playerId;
            });
            let results = _.partition(playingGamePlayers, {color: PlayerColor.RED});

            let player = playerHandler.findById(voteRound.playerId);
            let name = `${player.firstName} ${player.lastName}`;
            res.sendMessage(req.chatId, `Player ${name} is out of the game!`);

            // Check if game ended
            if (results[0].length == results[1].length) {
                gameHandler.finishGame(game);
                return res.sendMessage(req.chatId, `The reds win!`);
            }
            else if (results[0].length == 0) {
                gameHandler.finishGame(game);
                return res.sendMessage(req.chatId, `The blacks win!`);
            }
            else {
                gameHandler.setState(game, GameState.ACTIVE);
                return res.sendMessage(req.chatId, `Game is still ON!!!`);
            }

            //TODO: Add cancel game
            //TODO: When performing actions check that the player can play
        } else {
            let numRejectedVotes = votes.length - acceptedVotes.length;
            let msg = `Thanks for voting! Status:\nIn favor: ${acceptedVotes.length}\nAgainst: ${numRejectedVotes}`;
            return res.sendMessage(req.chatId, msg);
        }

    }
    else {
        return res.sendMessage(req.chatId, `You cannot make a voting decision at this point.`);
    }
};