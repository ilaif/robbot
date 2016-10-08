'use strict';

let BaseDao = require('./base.dao'),
    Vote = require('../models/vote.model.js');

class VoteDao extends BaseDao {

    constructor() {
        super(Vote);
    }

}

module.exports = new VoteDao();