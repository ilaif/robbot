'use strict';

class Response {

    constructor(opts) {
        this._client = opts.client;
    }

    sendMessage(recipientId ,msg) {
        this._client.sendMessage(recipientId, msg);
    }
}

module.exports = Response;