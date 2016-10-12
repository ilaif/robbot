'use strict';

let BaseDao = require('./base.dao');
let GroupDao = require('./group.dao');
let GameDataModel = require('../data_models').Game;
let GroupDataModel = require('../data_models').Group;
let GameStatus = require('../enums/GameStatus');

class GameDao extends BaseDao {

    constructor() {
        super(GameDataModel);
    }

    findActiveGameByChatId(chatId) {
        return this.Model.findOne({
            where: {
                status: GameStatus.ACTIVE
            },
            include: [{
                model: GroupDataModel,
                where: {chatId}
            }]
        });
    }

    createByChatId(chatId) {
        return GroupDao.findOrCreate({chatId}, {chatId})
            .spread((group, updated) => {
                return this.Model.create({groupId: group.id});
            });
    }

}

module.exports = new GameDao();