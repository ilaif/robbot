'use strict';

let BaseDao = require('./base.dao'),
    GamePlayerDataModel = require('../data_models').GamePlayer;

class GamePlayerDao extends BaseDao {

    constructor() {
        super(GamePlayerDataModel);
    }

}

module.exports = new GamePlayerDao();