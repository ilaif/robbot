'use strict';

let gameController = require('../bot/controllers/game.controller'),
    playerController = require('../bot/controllers/player.controller'),
    Request = require('../bot/models/request.model'),
    _ = require('lodash'),
    botClient = require('../bot/libs/bot.lib').getClient(),
    Response = require('../bot/models/response.model');

let msg = {
    chat: {
        id: -172319289
    },
    from: {
        id: 44249087,
        first_name: 'Ilai',
        last_name: 'Fallach'
    },
    input: null
};

let req = new Request(msg, 'new', null),
    res = new Response({client: botClient});

gameController.newGame(req, res);

req = new Request(msg, 'join', null);
playerController.join(req, res);

req = new Request(msg, 'start', null);
gameController.startGame(req, res);

req = new Request(msg, 'vote_round', 'ilai');
playerController.startVoteRound(req, res);

req = new Request(msg, 'vote', 'yes');
playerController.vote(req, res);

req = new Request(msg, 'vote', 'no');
playerController.vote(req, res);