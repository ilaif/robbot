'use strict';

let utilsLib = require('../libs/utils.lib'),
    BaseModel = require('../models/base.model'),
    ModelEnum = require('../enums/Model'),
    VoteState = require('../enums/VoteState');

class VoteRound extends BaseModel {

    static getName() {
        return ModelEnum.VOTE_ROUND;
    }

    constructor(data) {

        super();

        this.playerId = data.playerId;
        this.gameId = data.gameId;
        this.round = data.round;

        this.state = data.state || VoteState.ACTIVE;
    }
}

module.exports = VoteRound;