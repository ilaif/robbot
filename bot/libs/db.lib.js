'use strict';

let _ = require('lodash'),
    Models = require('../enums/models'),
    utils = require('../libs/utils.lib');

var data = {};

utils.getEnumValues(Models).forEach(modelName => {
    data[modelName] = [];
});

exports.findAll = (name) => {
    return data[name];
};

exports.findById = (name, id) => {
    let result = _.filter(data[name], {id});
    return result.length > 0 ? result[0] : null;
};