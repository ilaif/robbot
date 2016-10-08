'use strict';

let Response = require('../models/response.model');

class Route {

    constructor(opts) {
        this._client = opts.client;
        this.res = new Response(opts);
    }

    onText(regex, cb) {
        this._client.onText(regex, cb);
    }

}

module.exports = Route;