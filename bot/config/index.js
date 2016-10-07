'use strict';

var defaultConfig = require('./index'),
    _ = require('lodash');

var tryRequire = (name) => {
    try {
        return require(name);
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            return false;
        }
    }
    return false;
};

let conf = tryRequire(`./${'default'}`);
module.exports = (conf) ? _.merge(defaultConfig, conf) : defaultConfig;