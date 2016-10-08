'use strict';

let utilsLib = require('../libs/utils.lib'),
    BaseModel = require('../models/base.model'),
    ModelEnum = require('../enums/Model'),
    VoteState = require('../enums/VoteState');

class Vote extends BaseModel {

    static getName() {
        return ModelEnum.VOTE;
    }

    constructor(data) {

        super();

        this.voteRoundId = data.voteRoundId;
        this.playerId = data.playerId; // The voter player id
        this.accepted = data.accepted;
    }
}

module.exports = Vote;