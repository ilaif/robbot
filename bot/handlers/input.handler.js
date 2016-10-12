'use strict';

let Request = require('../models/request.model.js');
let Promise = require('bluebird');
let playerHandler = require('../handlers/player.handler');
let gameHandler = require('../handlers/game.handler');

exports.parseCommand = (cmd, opts) => {
    return new Promise((resolve, reject) => {

        let msg = opts.msg,
            match = opts.match;

        let input = null;
        if (match && match.length > 1)
            input = match[1];

        let newMessage = {
            chatId: msg.chat.id
        };

        if (msg.from) {
            newMessage.from = {
                id: msg.from.id,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name
            };
        }

        newMessage.newParticipant = {};
        if (msg.new_chat_participant) {
            newMessage.newParticipant.firstName = msg.new_chat_participant.first_name;
            newMessage.newParticipant.lastName = msg.new_chat_participant.last_name;
            newMessage.newParticipant.id = msg.new_chat_participant.id;
        }

        newMessage.leftParticipant = {};
        if (msg.left_chat_participant) {
            newMessage.leftParticipant.firstName = msg.left_chat_participant.first_name;
            newMessage.leftParticipant.lastName = msg.left_chat_participant.last_name;
            newMessage.leftParticipant.id = msg.left_chat_participant.id;
        }

        return Promise.all([
                gameHandler.getGameByChatId(newMessage.chatId),
                playerHandler.findByTelegramId(newMessage.from.id)
            ])
            .spread((game, player) => {
                if (game)
                    return playerHandler.findByGameId(game.id)
                        .then(players => [game, player, players]);
                else
                    return Promise.resolve([game, player, null]);
            })
            .spread((game, player, players) => {
                resolve(new Request({msg: newMessage, cmd, input, game, player, players}));
            });
    });
};