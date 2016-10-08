'use strict';

let BaseError = require('./base.error').BaseError;

module.exports.dbError = class dbError extends BaseError {

    constructor(m) {
        super(m)
    }

};

module.exports.IdAlreadyExistsError = class IdAlreadyExistsError extends BaseError {

    constructor(data) {
        let m = `modelName ${data.modelName} already has id ${data.instanceId}`;
        super(m)
    }

};