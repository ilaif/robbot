'use strict';

let BaseDao = require('./base.dao');
let GroupDataModel = require('../data_models').Group;

class GroupDao extends BaseDao {

    constructor() {
        super(GroupDataModel);
    }

}

module.exports = new GroupDao();