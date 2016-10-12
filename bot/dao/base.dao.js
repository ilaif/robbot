'use strict';

class BaseDao {

    constructor(Model) {
        this.Model = Model;
    }

    findAll() {
        return this.Model.findAll();
    }

    find(filter) {
        return this.Model.findAll({where: filter});
    }

    findOne(filter) {
        return this.Model.findOne({where: filter})
    }

    findById(id) {
        return this.Model.findById(id);
    }

    create(object) {
        return this.Model.create(object);
    }

    save(instance) {
        return instance.save();
    }

    update(filter, values) {
        return this.Model.update(values, {where: filter})
            .then(res => {
                return {updated: res[0] > 0, amount: res[0]}
            });
    }

    findOrCreate(filter, defaults) {
        return this.Model.findOrCreate({where: filter, defaults})
            .spread((instance, updated) => {
                return [instance, updated];
            });
    }

}

module.exports = BaseDao;