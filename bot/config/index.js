'use strict';

var defaultConfig = require('./default'),
    env = process.env,
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

let envConf = tryRequire(`./${env.NODE_ENV}`);
module.exports = (envConf) ? _.merge(defaultConfig, envConf) : defaultConfig;