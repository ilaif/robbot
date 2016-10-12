'use strict';

let BaseDao = require('./base.dao');
let VoteRoundDataModel = require('../data_models').VoteRound;
let VoteDataModel = require('../data_models').Vote;

class VoteRoundDao extends BaseDao {

    constructor() {
        super(VoteRoundDataModel);
    }

    findWithVotesByGameIdRound(gameId, round) {
        return this.Model.findOne({
            where: {gameId, round},
            include: [{
                model: VoteDataModel
            }]
        });
    }

}

module.exports = new VoteRoundDao();