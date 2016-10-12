'use strict';

let BaseDao = require('./base.dao'),
    VoteDataModel = require('../data_models').Vote;

class VoteDao extends BaseDao {

    constructor() {
        super(VoteDataModel);
    }

}

module.exports = new VoteDao();