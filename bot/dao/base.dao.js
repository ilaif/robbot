'use strict';

let dbLib = require('../libs/db.lib');

class BaseDao {

    constructor(Model) {
        this.Model = Model;
    }

    findById(id) {
        return dbLib.findById(this.Model.getName(), id);
    }

    findAll() {
        return dbLib.findAll(this.Model.getName());
    }

    find(filter) {
        return dbLib.find(this.Model.getName(), filter);
    }

    findOne(filter) {
        return dbLib.findOne(this.Model.getName(), filter);
    }

    save(instance) {
        return dbLib.create(this.Model.getName(), instance);
    }

    create(attributes) {
        let instance = new this.Model(attributes);
        return this.save(instance);
    }

    findOrCreate(filter, defaults) {
        let instance = this.findOne(filter);
        if (instance)
            return {created: false, instance: instance};
        else {
            instance = this.create(defaults);
            return {created: true, instance}
        }
    }

    update(instance) {
        return dbLib.update(this.Model.getName(), instance);
    }

    updateAttributes(instance, attributes) {
        return dbLib.updateAttributes(this.Model.getName(), instance, attributes);
    }

}

module.exports = BaseDao;