'use strict';

let BaseDao = require('./base.dao'),
    _ = require('lodash'),
    Game = require('../models/game.model');

class GameDao extends BaseDao {

    constructor() {
        super(Game);
    }

    findGameByChatId(chatId) {
        let res = _.filter(this.findAll(), {chatId});
        return res.length > 0 ? res[0] : null;
    }

}

module.exports = new GameDao();