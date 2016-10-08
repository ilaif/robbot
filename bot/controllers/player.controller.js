'use strict';

let gameHandler = require('../handlers/game.handler'),
    GameState = require('../enums/GameState'),
    Vote = require('../enums/Vote'),
    playerHandler = require('../handlers/player.handler'),
    voteHandler = require('../handlers/vote.handler'),
    _ = require('lodash'),
    msgLib = require('../libs/message.lib');

exports.join = (bot, userInput) => {

    let isGameActive = gameHandler.isActive(userInput.chatId);

    if (!isGameActive)
        return msgLib.sendMessage(bot, userInput.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(userInput.chatId);

    if (game.state == GameState.INIT) {

        let playerData = userInput.from;

        let res = playerHandler.addToGame(game, playerData);

        if (res.added) {
            return msgLib.sendMessage(bot, userInput.chatId, `Good luck ${res.instance.firstName}, you have successfully joined the game.`);
        } else {
            return msgLib.sendMessage(bot, userInput.chatId, `You are already subscribed you silly one ^^.`);
        }
    }
    else {
        return msgLib.sendMessage(bot, userInput.chatId, `You cannot join the game at this point.`);
    }
};

let playerNamesWithIds = (players) => players.map((p, i) => `${i} - ${p.firstName} ${p.lastName}`);

exports.startVoteRound = (bot, userInput) => {

    let isGameActive = gameHandler.isActive(userInput.chatId);

    if (!isGameActive)
        return msgLib.sendMessage(bot, userInput.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(userInput.chatId);

    if (game.state == GameState.ACTIVE) {

        let playerIdentifier = userInput.input;
        let playingPlayers = playerHandler.getPlaying(game.players);
        let players = playerHandler.findPlayersInGroupByIdentifier(playingPlayers, playerIdentifier);

        if (players.length == 0) {
            let names = playerNamesWithIds(players).join('\n');
            return msgLib.sendMessage(bot, userInput.chatId, `No player names found, please choose from this list:\n${names}`);
        }
        else if (players.length > 1) {
            let names = playerNamesWithIds(players).join('\n');
            return msgLib.sendMessage(bot, userInput.chatId, `Multiple results for player, please write it accurately or use player id:\n${names}`);
        }
        else {
            let name = `${players[0].firstName} ${players[0].lastName}`;
            let player = players[0];

            let voteRound = voteHandler.startRound(game, player);

            return msgLib.sendMessage(bot, userInput.chatId, `${name} is up for a vote! Is he Black or Red??? Make your discussions and vote by typing /yes or /no.`);
        }
    }
    else {
        return msgLib.sendMessage(bot, userInput.chatId, `You cannot vote a player at this point.`);
    }
};

//TODO: Add player names or users when replying to them.

exports.vote = (bot, userInput) => {

    let isGameActive = gameHandler.isActive(userInput.chatId);

    if (!isGameActive)
        return msgLib.sendMessage(bot, userInput.chatId, `There's no active game, type /new to start a new game.`);

    let game = gameHandler.getGameByChatId(userInput.chatId);

    if (game.state == GameState.VOTE_ROUND) {

        // TODO: Service:
        let voteRound = voteHandler.getVoteRoundByGame(game);
        let votes = voteHandler.getVotesByRound(voteRound);
        let vote = _.find(votes, {playerId: userInput.from.id});

        if (vote) {
            if (userInput.input == vote.accepted) {
                return msgLib.sendMessage(bot, userInput.chatId, `You have already voted ${vote.accepted} for this vote round.`);
            } else {
                voteHandler.setVote(vote, !vote.accepted);
                msgLib.sendMessage(bot, userInput.chatId, `Changed your vote!`);
            }
        }
        else {
            vote = voteHandler.vote(voteRound.id, userInput.from.id, vote.accepted);
            votes.push(vote); // Updating local state
        }

        let numPlayers = playerHandler.getPlaying(game.players).length;
        let numAcceptedVotes = _.filter(votes, {accepted: true});

        // Check if there's a majority of votes
        if (numAcceptedVotes > (numPlayers / 2)) {
            playerHandler.kickPlayer(voteRound);
            //TODO: When performing actions check that the player can play
        } else {

        }

    }
    else {
        return msgLib.sendMessage(bot, userInput.chatId, `You cannot make a voting decision at this point.`);
    }
};