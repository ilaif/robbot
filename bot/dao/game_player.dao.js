'use strict';

let BaseDao = require('./base.dao'),
    _ = require('lodash'),
    GamePlayer = require('../models/game_player.model');

class GamePlayerDao extends BaseDao {

    constructor() {
        super(GamePlayer);
    }

}

module.exports = new GamePlayerDao();