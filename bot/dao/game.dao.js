'use strict';

let BaseDao = require('./base.dao'),
    _ = require('lodash'),
    Models = require('../enums/models');

class GameDao extends BaseDao {

    constructor() {
        super(Models.GAME);
    }

    findGameByChatId(chatId) {
        let res = _.filter(this.findAll(), {chatId});
        return res.length > 0 ? res[0] : null;
    }

}

module.exports = new GameDao();