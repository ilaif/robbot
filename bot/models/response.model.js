'use strict';

class Response {

    constructor(opts) {
        this._client = opts.client;
    }

    sendMessage(recipientId ,msg) {
        this._client.sendMessage(recipientId, msg);
    }

    sendSticker(recipientId, sticker, opts) {
        return this._client.sendSticker(recipientId, sticker, opts);
    }
}

module.exports = Response;