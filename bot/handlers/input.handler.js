'use strict';

let Request = require('../models/request.model.js');

exports.parseCommand = (cmd, opts) => {
    let msg = opts.msg,
        match = opts.match;

    let input = null;
    if (match.length > 1)
        input = match[1];

    return new Request(msg, cmd, input);
};