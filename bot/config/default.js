'use strict';

var _ = require('lodash');

module.exports = {
    botToken: process.env.BOT_TOKEN || '294935473:AAGnEMyz5xbJ5YPwIAXi11b3tvoHxxgxOHU',
    noRules: !!(process.env.NO_RULES || 0)
};