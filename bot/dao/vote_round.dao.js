'use strict';

let BaseDao = require('./base.dao'),
    _ = require('lodash'),
    VoteRound = require('../models/vote_round.model.js');

class VoteRoundDao extends BaseDao {

    constructor() {
        super(VoteRound);
    }

}

module.exports = new VoteRoundDao();