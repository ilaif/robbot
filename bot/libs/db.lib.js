'use strict';

let _ = require('lodash'),
    Models = require('../enums/Model'),
    dbErrors = require('../errors/db.error'),
    utils = require('../libs/utils.lib');

var data = {};

utils.getEnumValues(Models).forEach(modelName => {
    data[modelName] = [];
});

exports.findAll = (name) => {
    return data[name];
};

exports.find = (name, filter) => {
    return _.filter(data[name], filter);
};

exports.findOne = (name, filter) => {
    let result = exports.find(name, filter);
    return result.length > 0 ? result[0] : null;
};

exports.findById = (name, id) => {
    let result = _.filter(data[name], {id});
    return result.length > 0 ? result[0] : null;
};

exports.create = (name, instance) => {

    let i = _.findIndex(data[name], {id: instance.id});
    if (i > -1) {
        throw new dbErrors.IdAlreadyExistsError({modelName: name, instanceId: instance.id});
    }

    data[name].push(instance);

    return instance;
};

exports.update = (name, instance) => {

    let i = _.findIndex(data[name], {id: instance.id});
    if (i == -1) {
        throw Error('Instance not found');
    }

    data[name][i] = instance;

    return instance;
};

exports.updateAttributes = (name, instance, attributes) => {
    let i = _.findIndex(data[name], {id: instance.id});
    if (i == -1) {
        throw Error('Instance not found');
    }

    _.forEach(attributes, (value, key) => {
        instance[key] = value;
    });

    data[name][i] = instance;

    return instance;
};