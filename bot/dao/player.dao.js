'use strict';

let BaseDao = require('./base.dao'),
    Player = require('../models/player.model');

class PlayerDao extends BaseDao {

    constructor() {
        super(Player);
    }

}

module.exports = new PlayerDao();