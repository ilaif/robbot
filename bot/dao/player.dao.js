'use strict';

let BaseDao = require('./base.dao');
let GameDataModel = require('../data_models').Game;
let GamePlayerDataModel = require('../data_models').GamePlayer;
let PlayerDataModel = require('../data_models').Player;

class PlayerDao extends BaseDao {

    constructor() {
        super(PlayerDataModel);
    }

    findByGameId(gameId) {
        return this.Model.findAll({
            include: [{
                model: GameDataModel,
                where: {id: gameId}
            }]
        }).then(players => {
            return players.map(p => {
                p.gamePlayer = p.games[0].gamePlayer;
                return p;
            });
        })
    }

}

module.exports = new PlayerDao();