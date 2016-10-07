'use strict';

let dbLib = require('../libs/db.lib');

class BaseDao {

    constructor(name) {
        this.name = name;
    }

    findById(id) {
        return dbLib.findById(this.name, id);
    }

    findAll() {
        return dbLib.findAll(this.name);
    }

}

module.exports = BaseDao;